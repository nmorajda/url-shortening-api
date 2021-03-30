import '../scss/main.scss';

window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const btnHamburger = document.querySelector('.btn-hamburger');
  const header = document.querySelector('.header');
  const dropdown = document.querySelectorAll('.has-dropdown');

  const shortenForm = document.querySelector('.shorten__form');
  const shortenInput = document.getElementById('shortenIt');

  const handleBtnHamburger = () => {
    body.classList.toggle('overflow-hidden');
    btnHamburger.classList.toggle('btn-hamburger--open');
    header.classList.toggle('mobile-nav--active');
  };

  const handleDropdownMenu = e => {
    console.log('click');
  };

  // Disable browser validation
  shortenForm.setAttribute('novalidate', true);

  const handleShortenForm = e => {
    e.preventDefault();

    const showSuccess = () => {
      shortenInput.parentElement.className = 'form__field form__field--success';
      shortenInput.nextElementSibling.textContent = '';
    };

    const showError = () => {
      shortenInput.parentElement.className = 'form__field form__field--error';
      shortenInput.nextElementSibling.textContent =
        shortenInput.dataset.errorMessage;
    };

    // Disable browser validation
    shortenForm.novalidate = true;

    shortenInput.validity.valid ? showSuccess() : showError();
  };

  // EVENTS
  // mobile menu open/close
  btnHamburger.addEventListener('click', handleBtnHamburger);

  // dropdown menu
  document.addEventListener('click', e => {
    if (e.target.closest('.has-dropdown')) {
      const current = e.target.closest('.has-dropdown');

      // disabled all dropdown without clicked
      dropdown.forEach(content => {
        if (content !== current) {
          content.classList.remove('is-active');
        }
      });

      current.classList.toggle('is-active');
    }
  });

  shortenForm.addEventListener('submit', handleShortenForm);
});
