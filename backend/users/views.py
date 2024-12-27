from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'login': reverse('login', request=request, format=format),
        'signup': reverse('signup', request=request, format=format),
        'logout': reverse('logout', request=request, format=format),
    })

@api_view(['POST'])
def signup_view(request):
    data = request.data
    try:
        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            first_name=data['name']
        )
        return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    data = request.data
    user = authenticate(username=data['email'], password=data['password'])
    if user is not None:
        login(request, user)
        return Response({'status': 'Success'})
    return Response({'status': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@ensure_csrf_cookie
def logout_view(request):
    try:
        logout(request)
        response = Response({'status': 'success'})
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')
        return response
    except Exception as e:
        print(f"Logout error: {str(e)}")  # Add debugging
        return Response(
            {'status': 'error', 'message': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_csrf_token(request):
    return Response({'csrfToken': get_token(request)})
