import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './api.js';

let page = 1;
let existsPhotos = [];
const inputEl = document.querySelector('input[type="text"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

function clearSearch() {
  galleryEl.innerHTML = '';
  existsPhotos = [];
}

const loadPhotos = async () => {
  try {
    const photos = await fetchPhotos(inputEl.value, page);
    let result = photos.data.totalHits;

    if (result === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notiflix.Notify.success(`Hooray! We found ${result} images.)`);
    galleryEl.innerHTML = showPhotoCards(photos);
    let gallery = new SimpleLightbox('.gallery a');
    gallery.on('show.simplelightbox');

    if (result <= page * 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.add('is-hidden');
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }

    if (page >= 1) {
      gallery.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 3,
        behavior: 'smooth',
      });
    }
  } catch (err) {
    console.error('Error loading photos:', err);
  }
};

function showPhotoCards(photos) {
  const arrayOfPhotos = photos.data.hits;
  existsPhotos.push(...arrayOfPhotos);
  return existsPhotos
    .map(
      card => `
      <div class="photo-card">
        <div class="photo-container">
          <a href="${card.largeImageURL}">
            <img src="${card.webformatURL}" width=100% alt="${card.tags}" loading="lazy" />
          </a>
        </div>
        
        <div class="info">
           <p class="info-item">
             <b>Likes:<br>${card.likes}</b>
           </p>
           <p class="info-item">
             <b>Views:<br>${card.views}</b>
           </p>
           <p class="info-item">
             <b>Comments:<br>${card.comments}</b>
           </p>
           <p class="info-item">
             <b>Downloads:<br>${card.downloads}</b>
           </p>
        </div>
       </div>`
    )
    .join('');
}

const formEl = document.getElementById('search-form');
formEl.addEventListener('submit', event => {
  event.preventDefault();
  clearSearch();
  loadPhotos();
});

loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  page++;
  loadPhotos();
});
