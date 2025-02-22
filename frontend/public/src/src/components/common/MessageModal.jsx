import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../../styles/MessageModal.scss';
import logo from "../../assets/images/logo.svg";

const MessageModal = ({show, onHide, message}) => {
    // Определяем класс в зависимости от типа сообщения
    const getMessageClass = () => {
        switch (message?.type) {
            case 'success':
                return 'message-success';
            case 'error':
                return 'message-error';
            case 'warning':
                return 'message-warning';
            case 'info':
                return 'message-info';
            default:
                return '';
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="message-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">
                    <img src={logo} alt="Tasty" className="tasty-logo"/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={`message-content ${getMessageClass()}`}>
                    {message?.text}
                </div>
            </Modal.Body>
        </Modal>
    );
};

MessageModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    message: PropTypes.shape({
        type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
        text: PropTypes.string
    })
};

export default MessageModal;