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
            data = {
                'id': person.id,
                'full_name': person.full_name,
                'phone_number': person.phone_number,
                'email': person.email,
                'image': request.build_absolute_uri(person.image.url) if person.image else None
            }
        else:
            persons = Person.objects.all()
            data = [
                {
                    'id': p.id,
                    'full_name': p.full_name,
                    'phone_number': p.phone_number,
                    'email': p.email,
                    'image': request.build_absolute_uri(p.image.url) if p.image else None
                }
                for p in persons
            ]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        # Accept both multipart form data and raw JSON fallback
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.POST
            files = request.FILES
        else:
            try:
                data = json.loads(request.body)
                files = None
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid payload'}, status=400)

        form = PersonForm(data, files)
        if form.is_valid():
            person = form.save()
            return JsonResponse({'message': 'Saved successfully!', 'id': person.id}, status=201)
        return JsonResponse(form.errors, status=400)

    elif request.method in ['PUT', 'PATCH']:
        if not pk:
            return JsonResponse({'error': 'ID is required for updates'}, status=400)
            
        person = get_object_or_404(Person, pk=pk)

        # For multipart forms sent via POST/PUT, read from POST and FILES
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Django only parses request.POST on POST methods; parse body if method is PUT/PATCH
            if request.method in ['PUT', 'PATCH'] and not request.POST:
                data, files = request.parse_file_upload(request.META, request)
            else:
                data = request.POST
                files = request.FILES
        else:
            try:
                data = json.loads(request.body)
                files = None
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)

        form = PersonForm(data, files, instance=person)
        
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