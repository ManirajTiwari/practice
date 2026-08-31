import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Person
from .form import PersonForm

@csrf_exempt
def person_api_view(request, pk=None):
    if request.method == 'GET':
        if pk:
            person = get_object_or_404(Person, pk=pk)
            data = {'id': person.id, 'full_name': person.full_name, 'phone_number': person.phone_number, 'email': person.email}
        else:
            persons = Person.objects.all()
            data = [{'id': p.id, 'full_name': p.full_name, 'phone_number': p.phone_number, 'email': p.email} for p in persons]
        return JsonResponse(data, safe=False)

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

    elif request.method in ['PUT', '']:
        if not pk:
            return JsonResponse({'error': 'ID is required for updates'}, status=400)
            
        person = get_object_or_404(Person, pk=pk)
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # PATCH allows partial updates; PUT expects a complete resource replacement.
        # For vanilla forms, passing data with existing instance fields or handling unrequired fields 
        # requires setting form fields as optional (blank=True/null=True in model/form) if doing true PATCH.
        is_partial = request.method == 'PATCH'
        
        # If doing a true PUT, missing fields should clear or fail. If PATCH, we can bind selectively.
        form = PersonForm(payload, instance=person)
        
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'Updated successfully!'})
        return JsonResponse(form.errors, status=400)

    elif request.method == 'DELETE':
        if not pk:
            return JsonResponse({'error': 'ID is required for deletion'}, status=400)
            
        person = get_object_or_404(Person, pk=pk)
        person.delete()
        return JsonResponse({'message': 'Deleted successfully!'})

    return HttpResponseNotAllowed(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])