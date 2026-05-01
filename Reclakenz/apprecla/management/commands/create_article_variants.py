from django.core.management.base import BaseCommand
from apprecla.models import Article, ArticleVariant

class Command(BaseCommand):
    help = 'Create article variants with different weights for existing articles'

    def handle(self, *args, **options):
        # Articles qui ont généralement des variantes de poids
        articles_with_variants = {
            # KenzPat - produits en vrac
            'Semoule Grosse Premium Kenz': ['1kg', '5kg', '10kg', '25kg'],
            'Semoule Fine Premium Kenz': ['1kg', '5kg', '10kg', '25kg'],
            'Semoule finot Premium Kenz': ['1kg', '5kg', '10kg'],
            'Semoule complète Kenz': ['1kg', '5kg', '10kg'],
            'Couscous Grain Moyen Kenz': ['500g', '1kg', '5kg', '10kg'],
            'Couscous Grain Fin Kenz': ['500g', '1kg', '5kg', '10kg'],
            'Farine de Blé T55 Kenz': ['1kg', '5kg', '10kg', '25kg'],
            'Farine de Blé T65 Kenz': ['1kg', '5kg', '10kg', '25kg'],
            'Semoule de Maïs Kenz': ['1kg', '5kg', '10kg'],
            
            # Kenz Maroc - produits traditionnels
            'Couscous Traditionnel Maroc': ['500g', '1kg', '5kg'],
            'Couscous Bio Maroc': ['500g', '1kg', '2kg'],
            'Farine Complète Bio Maroc': ['1kg', '5kg', '10kg'],
            'Semoule de Blé Dur Maroc': ['1kg', '5kg', '10kg', '25kg'],
            'Couscous Perlé Maroc': ['500g', '1kg'],
            'Couscous Intégral Maroc': ['500g', '1kg', '2kg'],
            
            # Vitagrain - produits santé
            'Flocons d\'Avoine Vitagrain': ['500g', '1kg', '2kg'],
            'Quinoa Bio Vitagrain': ['500g', '1kg'],
            'Riz Basmati Vitagrain': ['1kg', '5kg', '10kg'],
            'Lentilles Corail Vitagrain': ['500g', '1kg', '2kg'],
            'Pois Chiches Bio Vitagrain': ['500g', '1kg', '2kg'],
        }

        created_count = 0
        
        for article_name, weights in articles_with_variants.items():
            try:
                # Gérer les articles en double en prenant le premier
                articles = Article.objects.filter(nom=article_name)
                if not articles.exists():
                    self.stdout.write(f'Article non trouvé: {article_name}')
                    continue
                
                article = articles.first()
                if articles.count() > 1:
                    self.stdout.write(f'Attention: {articles.count()} articles trouvés pour "{article_name}", utilisation du premier')
                
                for weight in weights:
                    # Vérifier si la variante existe déjà
                    variant, created = ArticleVariant.objects.get_or_create(
                        article=article,
                        weight=weight,
                        defaults={
                            'is_available': True,
                            'price': None  # Prix à définir par l'admin
                        }
                    )
                    
                    if created:
                        created_count += 1
                        self.stdout.write(f'Variante créée: {article_name} - {weight}')
                    else:
                        self.stdout.write(f'Variante existe déjà: {article_name} - {weight}')
                        
            except Exception as e:
                self.stdout.write(f'Erreur pour {article_name}: {str(e)}')
                continue

        self.stdout.write(
            self.style.SUCCESS(
                f'Terminé! {created_count} variantes créées.'
            )
        )
