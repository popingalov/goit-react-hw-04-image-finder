import PropTypes from 'prop-types';
import s from './Modal.module.css';
import { createPortal } from 'react-dom';
import { useEffect } from 'react/cjs/react.production.min';
const modalRoot = document.querySelector('#modal-root');
export default function Modal({ toggle, url }) {
  useEffect(() => {
    const handleKeyDown = e => e.code === 'Escape' && toggle();

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggle]);

  const handleBackdropClick = e => {
    e.currentTarget === e.target && this.props.toggle();
  };

  return createPortal(
    <div className={s.Overlay} onClick={handleBackdropClick}>
      <div className={s.Modal}>
        <img src={url} alt="" />
      </div>
    </div>,
    modalRoot,
  );
}

Modal.propTypes = {
  toggle: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};
