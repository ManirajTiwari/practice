import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Person
from .form import PersonForm

@csrf_exempt
def person_api_view(request, pk=None):
    # GET: Retrieve all persons or a single person
    if request.method == 'GET':
        if pk:
            person = get_object_or_404(Person, pk=pk)
            data = {'id': person.id, 'full_name': person.full_name, 'phone_number': person.phone_number, 'email': person.email}
        else:
            persons = Person.objects.all()
            data = [{'id': p.id, 'full_name': p.full_name, 'phone_number': p.phone_number, 'email': p.email} for p in persons]
        return JsonResponse(data, safe=False)

    # POST: Create a new person
    elif request.method == 'POST':
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        form = PersonForm(payload)
        if form.is_valid():
            person = form.save()
            return JsonResponse({'message': 'Saved successfully!', 'id': person.id}, status=201)
        return JsonResponse(form.errors, status=400)

    # PUT: Update an existing person
    elif request.method == 'PUT':
        if not pk:
            return JsonResponse({'error': 'ID is required for updates'}, status=400)
            
        person = get_object_or_404(Person, pk=pk)
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Passing instance=person tells Django to UPDATE this instance
        form = PersonForm(payload, instance=person)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'Updated successfully!'})
        return JsonResponse(form.errors, status=400)

    return HttpResponseNotAllowed(['GET', 'POST', 'PUT'])