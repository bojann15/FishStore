from django.urls import path
from products.views import user_views


urlpatterns = [
    path('login', user_views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('register', user_views.registerUser, name='register'),
    path('profile', user_views.getUser, name='user'),
    path('profile/update', user_views.updateUserProfile, name='user-update'),
    path('', user_views.getUsers, name='users'),
    path('<str:pk>', user_views.getUserById, name='user-id'),
    path('update/<str:pk>', user_views.updateUser, name='user-update-id'),
    path('delete/<str:pk>', user_views.deleteUser, name='user-delete'),

]
