import { useState, useEffect } from 'react';
import SearchBar from 'components/SearchBar/SearchBar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Modal from 'components/Modal/Modal';
import Button from './components/Button/Button';
import Idle from 'components/ImageGallery/status/Idle';
import Spiner from 'components/ImageGallery/status/spiner/Spiner';
import Rejected from 'components/ImageGallery/status/Rejected';
/* import { ToastContainer } from 'react-toastify'; */
import Api from './service/Api';
function App() {
  const [searchForm, setSearchForm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeUrl, setLargeUrl] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [arrayImage, setArrayImage] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (page !== 1) {
      apiArray(searchForm, page).then(res => {
        setArrayImage(e => [...e, ...res]);
        setStatus('resolved');
        document
          .getElementById('scroll')
          .scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
      return;
    }
    if (searchForm !== '') {
      setStatus('pending');
      setArrayImage([]);
      apiArray(searchForm, 1)
        .then(res => {
          if (res.length > 0) {
            setArrayImage(res);
            setStatus('resolved');
            return;
          }
          setError(
            `По вашему запросу ${searchForm} небыло совпадений, крутите барабан`,
          );
          setStatus('rejected');
          setTimeout(() => {
            setStatus('idle');
          }, 2000);
        })
        .catch(error => () => {
          setError(`Чёт пошло не так: ${error.message}`);
          setStatus('rejected');
          setTimeout(() => {
            setStatus('idle');
          }, 2000);
        });
    }
  }, [searchForm, page]);

  const saveSearch = searchForm => {
    setSearchForm(searchForm);
    setPage(1);
  };
  const apiArray = (formRes, page) => {
    return Api(formRes, page);
  };
  const morePage = () => {
    setStatus('pending');
    setPage(p => p + 1);
  };
  const startStatus = () => {
    setStatus('idle');
  };

  const takeLarge = largeUrl => {
    setLargeUrl(largeUrl);
    toggleModal();
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <SearchBar saveSubmit={saveSearch} />
      <ImageGallery
        returnUrl={takeLarge}
        arrayImage={arrayImage}
        resetStatus={startStatus}
      />
      {showModal && <Modal url={largeUrl.largeImageURL} toggle={toggleModal} />}
      {arrayImage[0]?.loadMore > 12 && (
        <Button morePage={morePage} total={arrayImage[0].loadMore} />
      )}
      {status === 'idle' && <Idle />}

      {status === 'pending' && <Spiner />}

      {status === 'rejected' && <Rejected error={error} />}
    </div>
  );
}
export default App;
