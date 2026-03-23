import './stimulus_bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

document.documentElement.classList.add('has-js');

const revealNodes = document.querySelectorAll('[data-reveal]');

revealNodes.forEach((node) => {
	if (!node.classList.contains('is-visible')) {
		node.classList.add('reveal-pending');
	}
});

if ('IntersectionObserver' in window && revealNodes.length > 0) {
	const revealObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add('is-visible');
				entry.target.classList.remove('reveal-pending');
				observer.unobserve(entry.target);
			});
		},
		{
			root: null,
			rootMargin: '0px 0px -10% 0px',
			threshold: 0.12,
		},
	);

	revealNodes.forEach((node) => revealObserver.observe(node));
} else {
	revealNodes.forEach((node) => {
		node.classList.add('is-visible');
		node.classList.remove('reveal-pending');
	});
}

const sections = Array.from(document.querySelectorAll('[data-section]'));
const sideAnchors = Array.from(document.querySelectorAll('.side-anchor-nav [data-anchor]'));

if ('IntersectionObserver' in window && sections.length > 0 && sideAnchors.length > 0) {
	const anchorIndex = new Map(sideAnchors.map((anchor) => [anchor.getAttribute('href'), anchor]));

	const activateAnchor = (id) => {
		sideAnchors.forEach((anchor) => anchor.classList.remove('is-active'));

		const active = anchorIndex.get(`#${id}`);
		if (active) {
			active.classList.add('is-active');
		}
	};

	const sectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activateAnchor(entry.target.id);
				}
			});
		},
		{
			root: null,
			rootMargin: '-35% 0px -55% 0px',
			threshold: 0,
		},
	);

	sections.forEach((section) => sectionObserver.observe(section));
	activateAnchor('top');
}

const progressBar = document.getElementById('scroll-progress-bar');

if (progressBar) {
	const updateScrollProgress = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		const ratio = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 0;

		progressBar.style.width = `${ratio}%`;
	};

	updateScrollProgress();
	window.addEventListener('scroll', updateScrollProgress, { passive: true });
	window.addEventListener('resize', updateScrollProgress);
}

/* Certificate Modal Management */
const certificateModal = document.getElementById('certificate-modal');
const certificateTriggers = document.querySelectorAll('[data-cert-trigger]');
const certificateCloseButtons = document.querySelectorAll('[data-cert-close]');
const certificateImage = document.querySelector('.certificate-modal__image');

// Open modal
certificateTriggers.forEach((trigger) => {
	trigger.addEventListener('click', () => {
		if (certificateModal) {
			certificateModal.classList.add('is-open');
			document.body.style.overflow = 'hidden';
		}
	});
});

// Close modal
certificateCloseButtons.forEach((button) => {
	button.addEventListener('click', (e) => {
		e.stopPropagation();
		if (certificateModal) {
			certificateModal.classList.remove('is-open');
			document.body.style.overflow = '';
		}
	});
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && certificateModal && certificateModal.classList.contains('is-open')) {
		certificateModal.classList.remove('is-open');
		document.body.style.overflow = '';
	}
});

// Prevent right-click on certificate image
if (certificateImage) {
	certificateImage.addEventListener('contextmenu', (e) => e.preventDefault());
	certificateImage.addEventListener('dragstart', (e) => e.preventDefault());
	certificateImage.addEventListener('selectstart', (e) => e.preventDefault());
}

// Prevent text selection and copy on certificate
const imageContainer = document.querySelector('.certificate-modal__image-container');
if (imageContainer) {
	imageContainer.addEventListener('copy', (e) => e.preventDefault());
	imageContainer.addEventListener('cut', (e) => e.preventDefault());
}
