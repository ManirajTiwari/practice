from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # 'username' parameter holds either email or phone number from login input
        if username is None:
            username = kwargs.get('email') or kwargs.get('phone')

        try:
            # Query user by email OR phone_number
            user = User.objects.get(Q(email__iexact=username) | Q(phone_number=username))
        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None