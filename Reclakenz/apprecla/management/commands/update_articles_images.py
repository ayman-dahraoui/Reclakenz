from django.core.management.base import BaseCommand
from apprecla.models import Article

class Command(BaseCommand):
    help = 'Update existing articles with image URLs'

    def handle(self, *args, **options):
        # Mapping des articles avec leurs images
        articles_images = {
            # KenzPat
            'Semoule Grosse Premium Kenz': 'https://e-xportmorocco.com/uploads/products/1669/1669_1.jpg',
            'Semoule Fine Premium Kenz': 'https://e-xportmorocco.com/uploads/products/1670/1670_1.jpg',
            'Semoule finot Premium Kenz': 'https://e-xportmorocco.com/uploads/products/1671/1671_1.jpg',
            'Semoule complète Kenz': 'https://e-xportmorocco.com/uploads/products/1672/1672_1.jpg',
            'Couscous Grain Moyen Kenz': 'https://e-xportmorocco.com/uploads/products/1673/1673_1.jpg',
            'Couscous Grain Fin Kenz': 'https://e-xportmorocco.com/uploads/products/1674/1674_1.jpg',
            'Farine de Blé T55 Kenz': 'https://e-xportmorocco.com/uploads/products/1675/1675_1.jpg',
            'Petit plomb pates Kenz': 'https://e-xportmorocco.com/uploads/products/1676/1676_1.jpg',
            'Semoule Extra Fine Kenz': 'https://e-xportmorocco.com/uploads/products/1677/1677_1.jpg',
            'Farine de Blé T65 Kenz': 'https://e-xportmorocco.com/uploads/products/1678/1678_1.jpg',
            'Semoule de Maïs Kenz': 'https://e-xportmorocco.com/uploads/products/1679/1679_1.jpg',
            
            # Kenz Maroc
            'Couscous Traditionnel Maroc': 'https://e-xportmorocco.com/uploads/products/1680/1680_1.jpg',
            'Couscous Bio Maroc': 'https://e-xportmorocco.com/uploads/products/1681/1681_1.jpg',
            'Farine Complète Bio Maroc': 'https://e-xportmorocco.com/uploads/products/1682/1682_1.jpg',
            'Semoule de Blé Dur Maroc': 'https://e-xportmorocco.com/uploads/products/1683/1683_1.jpg',
            'Couscous Perlé Maroc': 'https://e-xportmorocco.com/uploads/products/1684/1684_1.jpg',
            'Farine de Sarrasin Maroc': 'https://e-xportmorocco.com/uploads/products/1685/1685_1.jpg',
            'Semoule Extra Fine Maroc': 'https://e-xportmorocco.com/uploads/products/1686/1686_1.jpg',
            'Couscous Intégral Maroc': 'https://e-xportmorocco.com/uploads/products/1687/1687_1.jpg',
            
            # Vitagrain
            'Céréales Muesli Vitagrain': 'https://e-xportmorocco.com/uploads/products/1688/1688_1.jpg',
            'Flocons d\'Avoine Vitagrain': 'https://e-xportmorocco.com/uploads/products/1689/1689_1.jpg',
            'Quinoa Bio Vitagrain': 'https://e-xportmorocco.com/uploads/products/1690/1690_1.jpg',
            'Riz Basmati Vitagrain': 'https://e-xportmorocco.com/uploads/products/1691/1691_1.jpg',
            'Lentilles Corail Vitagrain': 'https://e-xportmorocco.com/uploads/products/1692/1692_1.jpg',
            'Pois Chiches Bio Vitagrain': 'https://e-xportmorocco.com/uploads/products/1693/1693_1.jpg',
            'Graines de Tournesol Vitagrain': 'https://e-xportmorocco.com/uploads/products/1694/1694_1.jpg',
            'Mix Céréales Petit-Déjeuner Vitagrain': 'https://e-xportmorocco.com/uploads/products/1695/1695_1.jpg',
        }

        updated_count = 0
        
        for nom_article, image_url in articles_images.items():
            try:
                article = Article.objects.get(nom=nom_article)
                if not article.image:  # Seulement si pas d'image déjà
                    article.image = image_url
                    article.save()
                    updated_count += 1
                    self.stdout.write(f'Image mise à jour pour: {nom_article}')
                else:
                    self.stdout.write(f'Image déjà présente pour: {nom_article}')
            except Article.DoesNotExist:
                self.stdout.write(f'Article non trouvé: {nom_article}')
                continue

        self.stdout.write(
            self.style.SUCCESS(
                f'Terminé! {updated_count} articles mis à jour avec des images.'
            )
        )
