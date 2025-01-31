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
        # Check if user already exists
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'status': 'error', 'message': 'Email already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate required fields
        required_fields = ['email', 'password', 'name']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    {'status': 'error', 'message': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create user
        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            first_name=data['name']
        )
        
        # Log the user in after signup
        login(request, user)
        
        return Response({
            'status': 'success',
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])  # This is correct - only allowing POST method
def login_view(request):
    data = request.data
    try:
        user = authenticate(username=data['email'], password=data['password'])
        if user is not None:
            login(request, user)
            return Response({
                'status': 'Success',
                'user': {
                    'email': user.email,
                    'name': user.first_name
                }
            })
        return Response(
            {'status': 'error', 'message': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return Response(
            {'status': 'error', 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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
