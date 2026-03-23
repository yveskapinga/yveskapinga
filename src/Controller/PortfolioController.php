<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\LocaleAwareInterface;

final class PortfolioController extends AbstractController
{
    public function __construct(private readonly LocaleAwareInterface $translator)
    {
    }

    #[Route('/', name: 'app_portfolio')]
    public function index(Request $request): Response
    {
        $supportedLocales = ['fr', 'en'];
        $queryLocale = strtolower((string) $request->query->get('lang', ''));

        if (in_array($queryLocale, $supportedLocales, true)) {
            $locale = $queryLocale;
        } else {
            $locale = $request->getPreferredLanguage($supportedLocales) ?? 'en';
        }

        $request->setLocale($locale);
        $request->attributes->set('_locale', $locale);
        $this->translator->setLocale($locale);

        return $this->render('portfolio/index.html.twig', [
            'locale' => $locale,
            'switchLocale' => $locale === 'fr' ? 'en' : 'fr',
        ]);
    }
}
