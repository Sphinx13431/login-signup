from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import StudentAssessment  # Add this import
import logging
from django.views.decorators.http import require_POST

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'login': reverse('login', request=request, format=format),
        'signup': reverse('signup', request=request, format=format),
        'logout': reverse('logout', request=request, format=format),
    })

@api_view(['POST'])
def signup_view(request):
    try:
        data = request.data
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'status': 'error', 'message': 'Email already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_fields = ['email', 'password', 'name']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    {'status': 'error', 'message': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            first_name=data['name']
        )

        login(request, user)
        return Response({
            'status': 'success',
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Signup error: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])  # This is correct - only allowing POST method
def login_view(request):
    try:
        data = request.data
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
        print(f"Login error: {str(e)}")
        return Response(
            {'status': 'error', 'message': str(e)},
            status=status.HTTP_400_BAD_REQUEST
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
@ensure_csrf_cookie
def get_csrf_token(request):
    try:
        token = get_token(request)
        return Response({
            'csrfToken': token
        })
    except Exception as e:
        print(f"Error generating CSRF token: {str(e)}")
        return Response({
            'error': 'Failed to generate CSRF token'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@ensure_csrf_cookie
@require_POST
def save_student_assessment(request):
    print("Request received:", request.method)
    print("Headers:", dict(request.headers))
    print("User authenticated:", request.user.is_authenticated)

    if not request.user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        data = request.data
        print("Received data:", data)  # Debug print

        # Validate required fields
        required_fields = ['studentName', 'age', 'grade', 'yesCount']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return Response({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create new assessment entry
        assessment = StudentAssessment.objects.create(
            student_name=data['studentName'],
            age=int(data['age']),
            grade=str(data['grade']),
            yes_count=int(data['yesCount']),
            submitted_by=request.user
        )

        print(f"Assessment created: {assessment}")  # Debug print

        return Response({
            'status': 'success',
            'message': 'Assessment saved successfully',
            'yes_count': assessment.yes_count
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        import traceback
        print("Error traceback:", traceback.format_exc())
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
