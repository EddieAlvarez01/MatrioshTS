import swal from 'sweetalert2';

//ERROR ALERT
export function ErrorAlert(message){
    swal.fire({
        icon: 'error',
        text: message
    });
}