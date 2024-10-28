const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
const getCookie= (name) => {
    const cookies = document.cookie.split("; "); // Tách tất cả cookie thành mảng
    for (let cookie of cookies) {
        const [key, value] = cookie.split("="); // Tách tên và giá trị cookie
        if (key === name) {
            return decodeURIComponent(value); // Trả về giá trị cookie nếu tìm thấy
        }
    }
    return null; // Trả về null nếu không tìm thấy cookie
}
const  deleteAllCookies = () => {
    // Lấy tất cả các cookie dưới dạng chuỗi
    const cookies = document.cookie.split(";");

    // Duyệt qua từng cookie
    for (let cookie of cookies) {
        // Tách tên cookie từ chuỗi
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;

        // Xóa cookie bằng cách đặt ngày hết hạn về quá khứ
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}
export {setCookie,getCookie,deleteAllCookies}