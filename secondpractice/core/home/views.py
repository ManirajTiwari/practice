from django.shortcuts import render
from .form import PersonForm

def form_view(request):
    if request.method == "POST":
        full_name = request.POST.get('full_name')
        phone_number = request.POST.get('phone_number')
        email = request.POST.get('email')

        # Save data to database
        form = PersonForm(request.POST)
        if form.is_valid():
            form.save()

        return render(request, 'home/form.html', {'form':PersonForm(),'message': 'Saved successfully!'})

    else:
        form = PersonForm()

    # THIS RETURN WAS MISSING OR MISINDENTED IN YOUR CODE:
    return render(request, 'home/form.html', {'form':form})