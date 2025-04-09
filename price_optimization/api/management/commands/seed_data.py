# api/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group, Permission
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from api.models import Product, ProductHistory, MarketCondition, PriceOptimizationLog
from authentication.models import UserProfile, Role
from datetime import datetime, timedelta
import random
import decimal

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # Create user groups if they don't exist
        admin_group, _ = Group.objects.get_or_create(name='admin')
        buyer_group, _ = Group.objects.get_or_create(name='buyer')
        analyst_group, _ = Group.objects.get_or_create(name='analyst')
        supplier_group, _ = Group.objects.get_or_create(name='supplier')
        
        # Create roles
        for group in [admin_group, buyer_group, analyst_group, supplier_group]:
            Role.objects.get_or_create(
                group=group,
                defaults={'description': f'Role for {group.name} users'}
            )
        
        # Create permissions
        content_type = ContentType.objects.get_for_model(Product)
        view_pricing_perm, _ = Permission.objects.get_or_create(
            codename='view_product_pricing',
            name='Can view product pricing information',
            content_type=content_type,
        )
        optimize_pricing_perm, _ = Permission.objects.get_or_create(
            codename='optimize_product_pricing',
            name='Can optimize product pricing',
            content_type=content_type,
        )
        
        # Assign permissions to groups
        admin_group.permissions.add(view_pricing_perm, optimize_pricing_perm)
        analyst_group.permissions.add(view_pricing_perm, optimize_pricing_perm)
        buyer_group.permissions.add(view_pricing_perm)
        
        # Create test users
        users = {
            'admin_user': {'username': 'admin_user', 'password': 'Admin123!', 'email': 'admin@example.com', 'type': 'admin'},
            'buyer_user': {'username': 'buyer_user', 'password': 'Buyer123!', 'email': 'buyer@example.com', 'type': 'buyer'},
            'analyst_user': {'username': 'analyst_user', 'password': 'Analyst123!', 'email': 'analyst@example.com', 'type': 'analyst'},
            'supplier_user': {'username': 'supplier_user', 'password': 'Supplier123!', 'email': 'supplier@example.com', 'type': 'supplier'}
        }
        
        created_users = {}
        for key, user_data in users.items():
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['username'].split('_')[0].capitalize(),
                    'last_name': 'User'
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(f"Created user: {user.username}")
            
            # Create or update user profile
            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'user_type': user_data['type'],
                    'company': 'Test Company',
                    'phone': '555-123-4567'
                }
            )
            
            # Assign user to appropriate group
            if user_data['type'] == 'admin':
                user.groups.add(admin_group)
            elif user_data['type'] == 'buyer':
                user.groups.add(buyer_group)
            elif user_data['type'] == 'analyst': 
                user.groups.add(analyst_group)
            elif user_data['type'] == 'supplier':
                user.groups.add(supplier_group)
                
            created_users[key] = user
        
        # Create product categories
        categories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Books']
        
        # Create test products
        products = []
        for i in range(1, 21):  # Create 20 products
            category = random.choice(categories)
            cost_price = decimal.Decimal(random.uniform(10, 500)).quantize(decimal.Decimal('0.01'))
            margin = decimal.Decimal(random.uniform(0.1, 0.5)).quantize(decimal.Decimal('0.01'))
            selling_price = (cost_price * (1 + margin)).quantize(decimal.Decimal('0.01'))
            
            product, created = Product.objects.get_or_create(
                name=f"Test Product {i}",
                defaults={
                    'description': f"Description for test product {i}",
                    'cost_price': cost_price,
                    'selling_price': selling_price,
                    'category': category,
                    'stock_available': random.randint(0, 100),
                    'units_sold': random.randint(10, 1000),
                    'customer_rating': decimal.Decimal(random.uniform(1, 5)).quantize(decimal.Decimal('0.1')),
                    'created_by': created_users['admin_user']
                }
            )
            
            if created:
                self.stdout.write(f"Created product: {product.name}")
            products.append(product)
        
        # Create product history (last 12 months of data)
        today = timezone.now().date()
        for product in products:
            # Generate random sales pattern with some seasonality
            base_units = random.randint(50, 200)
            
            for i in range(1, 13):  # Last 12 months
                month_date = today.replace(day=1) - timedelta(days=30*i)
                
                # Add some seasonality (higher in months 6, 7, 11, 12)
                season_factor = 1.0
                if month_date.month in [6, 7]:  # Summer bump
                    season_factor = 1.3
                elif month_date.month in [11, 12]:  # Holiday bump
                    season_factor = 1.5
                
                # Random variation plus trend
                variation = random.uniform(0.8, 1.2)
                trend_factor = 1 + (i / 100)  # Slight upward trend over time
                
                # Calculate units and prices
                units = int(base_units * variation * season_factor / trend_factor)
                
                # Price fluctuations
                historical_cost = product.cost_price * decimal.Decimal(random.uniform(0.9, 1.1)).quantize(decimal.Decimal('0.01'))
                historical_price = product.selling_price * decimal.Decimal(random.uniform(0.9, 1.1)).quantize(decimal.Decimal('0.01'))
                
                ProductHistory.objects.get_or_create(
                    product=product,
                    month=month_date,
                    defaults={
                        'units_sold': units,
                        'selling_price': historical_price,
                        'cost_price': historical_cost
                    }
                )
        
        # Create market conditions
        market_trends = ['up', 'down', 'stable']
        market_conditions = [
            {
                'name': 'Summer Season',
                'category': 'Clothing',
                'trend': 'up',
                'impact_factor': 1.2,
                'start_date': today - timedelta(days=30),
                'end_date': today + timedelta(days=60)
            },
            {
                'name': 'Tech Shortage',
                'category': 'Electronics',
                'trend': 'up',
                'impact_factor': 1.15,
                'start_date': today - timedelta(days=15),
                'end_date': today + timedelta(days=45)
            },
            {
                'name': 'Economic Downturn',
                'category': 'Furniture',
                'trend': 'down',
                'impact_factor': 1.1,
                'start_date': today - timedelta(days=60),
                'end_date': today + timedelta(days=30)
            },
            {
                'name': 'Back to School',
                'category': 'Books',
                'trend': 'up',
                'impact_factor': 1.25,
                'start_date': today + timedelta(days=15),
                'end_date': today + timedelta(days=75)
            }
        ]
        
        for condition_data in market_conditions:
            condition, created = MarketCondition.objects.get_or_create(
                name=condition_data['name'],
                defaults={
                    'category': condition_data['category'],
                    'trend': condition_data['trend'],
                    'impact_factor': condition_data['impact_factor'],
                    'description': f"Market condition affecting {condition_data['category']} prices",
                    'start_date': condition_data['start_date'],
                    'end_date': condition_data['end_date'],
                    'created_by': created_users['analyst_user']
                }
            )
            
            if created:
                self.stdout.write(f"Created market condition: {condition.name}")
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded data!'))