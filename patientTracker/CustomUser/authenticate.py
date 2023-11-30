from rest_framework.authtoken.models import Token
from .models import CustomUser

def check_token(request):
    authorization_header = request.headers.get('Authorization')

    if authorization_header:
        token = authorization_header.split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token)
            return token_obj.user
        except Token.DoesNotExist:
            return 0
    else:
        return 0
    