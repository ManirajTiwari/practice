from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Person
from .form import PersonForm

@api_view(['GET', 'POST'])
def person_api_view(request):
    if request.method == 'GET':
        persons = Person.objects.all()
        serializer_data = [{'full_name': p.full_name, 'phone_number': p.phone_number, 'email': p.email} for p in persons]
        return Response(serializer_data)

    elif request.method == 'POST':
        form = PersonForm(request.POST or request.data)
        if form.is_valid():
            form.save()
            return Response({'message': 'Saved successfully!'}, status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)