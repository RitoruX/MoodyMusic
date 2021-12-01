const loading = document.querySelector('.loading')

function setLoading() {
  loading.classList.add('active')
}

function loadingDone() {
  loading.classList.remove('active')
}
