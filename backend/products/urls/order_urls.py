from django.urls import path
from products.views import order_views


urlpatterns = [
    path('', order_views.getOrders, name="orders"),
    path('add', order_views.addOrderItems, name="orders-add"),
    path('myorders', order_views.getMyOrders, name="myorders"),
    path('<str:pk>/deliver', order_views.updateOrdertoDelivered, name="deliver"),
    path('<str:pk>', order_views.getOrderByID, name="user-order"),
    path('<str:pk>/pay', order_views.updateOrdertoPaid, name="pay"),
    path('delete/<str:pk>', order_views.deleteOrder, name="order-delete"),
]
