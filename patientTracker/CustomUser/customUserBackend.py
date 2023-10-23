from django.contrib.auth import get_user_model
class CustomUserBackend:
    def authenticate(self,request,username=None,password=None):
        user_model = get_user_model
        try: 
            user = user_model.objects.get(username=username)
            if user.check_password(password):
                return user
        except Exception as e:
            return None