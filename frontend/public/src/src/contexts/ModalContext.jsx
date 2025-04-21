// Файл contexts/ModalContext.jsx
import { createContext, useState, useContext } from 'react';
import LoginModal from "../components/_common/modalWindows/LoginModal/LoginModal.jsx";
import RegisterModal from "../components/_common/modalWindows/RegisterModal/RegisterModal.jsx";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [activeModal, setActiveModal] = useState(null);
    const [modalProps, setModalProps] = useState({});

    const showModal = (modalName, props = {}) => {
        setActiveModal(modalName);
        setModalProps(props);
    };

    const hideModal = () => {
        setActiveModal(null);
        setModalProps({});
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}

            {/* Здесь рендерим все глобальные модальные окна */}
            <LoginModal
                show={activeModal === 'login'}
                onHide={hideModal}
                {...modalProps}
            />
            <RegisterModal
                show={activeModal === 'register'}
                onHide={hideModal}
                {...modalProps}
            />
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);