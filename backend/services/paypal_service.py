import os
import json
import base64
import requests
import qrcode
from io import BytesIO
from typing import Optional, Dict, Any
from datetime import datetime
from models import PaymentDocument, PaymentStatus, PaymentResponse

class PayPalService:
    def __init__(self):
        # Load environment variables
        from dotenv import load_dotenv
        from pathlib import Path
        
        ROOT_DIR = Path(__file__).parent.parent
        load_dotenv(ROOT_DIR / '.env')
        
        self.client_id = os.getenv('PAYPAL_CLIENT_ID')
        self.client_secret = os.getenv('PAYPAL_CLIENT_SECRET')
        self.mode = os.getenv('PAYPAL_MODE', 'sandbox')
        
        if not self.client_id or not self.client_secret:
            print(f"PayPal Client ID: {self.client_id}")
            print(f"PayPal Client Secret: {self.client_secret}")
            raise ValueError("PayPal credentials not found in environment variables")
        
        # Set base URL based on environment
        if self.mode == 'sandbox':
            self.base_url = "https://api.sandbox.paypal.com"
        else:
            self.base_url = "https://api.paypal.com"
        
    def get_access_token(self) -> str:
        """Get PayPal API access token"""
        url = f"{self.base_url}/v1/oauth2/token"
        
        headers = {
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization': f'Basic {base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()}'
        }
        
        data = 'grant_type=client_credentials'
        
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        
        return response.json()['access_token']
    
    def create_payment_link(self, amount: float, description: str) -> str:
        """Create PayPal.me payment link for simple payments"""
        # For sandbox testing, we'll use a simplified approach
        # In production, you might want to use proper PayPal checkout flow
        
        # Format: https://www.paypal.me/username/amount
        # For sandbox testing, we'll create a mock URL structure
        if self.mode == 'sandbox':
            base_url = "https://www.sandbox.paypal.com/paypalme"
        else:
            base_url = "https://www.paypal.com/paypalme"
        
        # Create a simplified payment link for testing
        payment_link = f"{base_url}/zzlobby/{amount:.2f}EUR"
        
        return payment_link
    
    def create_order(self, amount: float, description: str) -> Dict[str, Any]:
        """Create PayPal order using REST API"""
        access_token = self.get_access_token()
        
        url = f"{self.base_url}/v2/checkout/orders"
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}',
            'Prefer': 'return=representation'
        }
        
        order_data = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": "EUR",
                    "value": f"{amount:.2f}"
                },
                "description": description
            }],
            "application_context": {
                "return_url": "https://example.com/return",
                "cancel_url": "https://example.com/cancel"
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=order_data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"PayPal order creation error: {e}")
            raise
    
    def generate_qr_code(self, payment_url: str, amount: float) -> str:
        """Generate QR code for payment URL"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(payment_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    
    def create_payment(self, amount: float, description: str) -> PaymentResponse:
        """Create a new payment with PayPal integration"""
        try:
            # Create payment link (for simple payments)
            payment_url = self.create_payment_link(amount, description)
            
            # Try to create actual PayPal order for tracking
            try:
                order_result = self.create_order(amount, description)
                order_id = order_result.get('id', '')
                # Get approval URL from links
                approval_url = payment_url
                for link in order_result.get('links', []):
                    if link.get('rel') == 'approve':
                        approval_url = link.get('href', payment_url)
                        break
                payment_url = approval_url
            except Exception as e:
                print(f"Failed to create PayPal order, using simple payment link: {e}")
                order_id = f"pay_{int(datetime.now().timestamp())}"
            
            # Generate QR code
            qr_code = self.generate_qr_code(payment_url, amount)
            
            # Create payment document
            payment_doc = PaymentDocument(
                amount=amount,
                description=description,
                paypalPaymentId=order_id,
                paypalPaymentUrl=payment_url,
                status=PaymentStatus.ACTIVE
            )
            
            # Convert to response format
            response = PaymentResponse(
                id=payment_doc.id,
                amount=payment_doc.amount,
                description=payment_doc.description,
                paymentUrl=payment_doc.paypalPaymentUrl,
                qrCode=qr_code,
                status=payment_doc.status,
                createdAt=payment_doc.createdAt,
                completedAt=payment_doc.completedAt
            )
            
            return response
            
        except Exception as e:
            print(f"Payment creation error: {e}")
            raise
    
    def verify_payment(self, payment_id: str) -> bool:
        """Verify payment status with PayPal"""
        try:
            access_token = self.get_access_token()
            url = f"{self.base_url}/v2/checkout/orders/{payment_id}"
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            }
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            return result.get('status') == 'COMPLETED'
            
        except Exception as e:
            print(f"Payment verification error: {e}")
            return False

# Initialize service
paypal_service = PayPalService()