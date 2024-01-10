let currentRows = 0; // Số dòng hiện tại của ma trận
let currentCols = 0; // Số cột hiện tại của ma trận
let transposedMatrixResult  = []; // Mảng lưu trữ ma trận chuyển vị
let displayMessage = false; // Biến xác định việc hiển thị thông báo
let isTransposing = false; // Biến xác định trạng thái chuyển vị
let stopTransposingFlag = false; // Biến kiểm soát dừng quá trình chuyển vị
let isPaused = false; // Biến xác định trạng thái tạm dừng
let speed = 500; // Giá trị tốc độ ban đầu
let isResetting = false; // Biến xác định trạng thái reset

// Thêm sự kiện nghe cho thanh trượt tốc độ
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');

// Sự kiện click cho nút "Tạo Ma trận"
document.querySelector('button[onclick="createMatrix()"]').addEventListener('click', function () {
    if (isResetting) {
        return;
    }

    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1 || rows > 9 || cols > 9) {
        const matrixContainer = document.getElementById('matrixContainer');
        matrixContainer.innerHTML = '';
        // Nếu số dòng hoặc số cột không hợp lệ, ẩn nút "Reset" và "Thực hiện Chuyển Vị"
        document.querySelector('.btn-reset').style.display = 'none';
        document.querySelector('.btn-transpose').style.display = 'none';
        // Ẩn thanh tốc độ
        document.getElementById('speedContainer').style.display = 'none';
        return;
    }

    // Nếu số dòng và số cột hợp lệ, hiển thị nút "Reset" và "Thực hiện Chuyển Vị"
    document.querySelector('.btn-reset').style.display = 'inline-block';
    document.querySelector('.btn-transpose').style.display = 'inline-block';
    // Hiển thị thanh tốc độ
    document.getElementById('speedContainer').style.display = 'block';
});

speedSlider.addEventListener('input', function () {
    speedValue.innerText = this.value + ' ms';
});

// Hàm thiết lập tốc độ
function setSpeed(value) {
    const speedSlider = document.getElementById('speed');
    speedSlider.value = value;
    document.getElementById('speedValue').innerText = value + ' ms';
}

// nút reset 
function resetMatrix() {
    // Nếu đang trong quá trình reset, không thực hiện thêm reset
    if (isResetting) {
        return;
    }

    const matrixContainer = document.getElementById('matrixContainer');
    const transposedMatrixContainer = document.getElementById('transposedMatrixContainer');

    if (transposedMatrixResult ) {
        transposedMatrixResult  = [];
    }

    // Xóa nội dung của container
    matrixContainer.innerHTML = '';
    transposedMatrixContainer.innerHTML = '';

    // Đặt giá trị của isResetting là true khi bắt đầu reset
    isResetting = true;

    // Ẩn thông báo khi reset
    displayMessage = true;
    displayStatusMessage('Đang trong quá trình reset. Vui lòng đợi khoảng 1s...');

    // Đặt giá trị của isTransposing là false khi reset
    isTransposing = false;

    // Ẩn nút "Chuyển vị" và "Reset"
    document.querySelector('.btn-reset').style.display = 'none';
    document.querySelector('.btn-transpose').style.display = 'none';

    // Hiển thị lại nút "Tạo Ma trận"
    document.getElementById('rows').disabled = false;
    document.getElementById('cols').disabled = false;
    document.querySelector('button[onclick="createMatrix()"]').disabled = false;

    // Đặt giá trị của isPaused về false khi reset
    isPaused = false;

    // Ẩn nút "Tạm dừng" nếu đang hiển thị
    document.getElementById('pauseResumeButton').style.display = 'none';

    // Đặt giá trị của nút "Tạm dừng" về trạng thái ban đầu
    document.getElementById('pauseResumeButton').textContent = 'Tạm dừng';

    // Ẩn thanh tốc độ
    document.getElementById('speedContainer').style.display = 'none';
    // Đặt lại giá trị của thanh tốc độ là 500
    setSpeed(500);

    stopTransposingFlag = true;

    // Ẩn thông báo sau 1 giây
    setTimeout(function () {
        displayStatusMessage('Đã reset thành công.');
        // Đặt giá trị của isResetting là false sau khi hoàn thành reset
        isResetting = false;
    }, 1500);
}


// Hàm tạm dừng/tiếp tục quá trình chuyển vị
function pauseTranspose() {
    // Đảo ngược trạng thái tạm dừng
    isPaused = !isPaused;
    displayMessage = true;

    // Đặt nội dung và lớp của nút dựa trên trạng thái tạm dừng
    const pauseResumeButton = document.querySelector('.footer button.btn-danger');
    if (isPaused) {
        pauseResumeButton.textContent = 'Tiếp tục';
    } else {
        pauseResumeButton.textContent = 'Tạm dừng';
    }

    // Nếu đang chuyển vị và đã bấm tạm dừng, hiển thị thông báo
    if (isTransposing && isPaused) {
        displayStatusMessage('Đã tạm dừng chuyển vị');
    } else {
        // Nếu không còn tạm dừng, ẩn thông báo
        displayStatusMessage('Đang chuyển vị...');
    }
}

// Hàm hiển thị ma trận
function displayMatrix(matrix, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let i = 0; i < matrix.length; i++) {
        const row = matrix[i];
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';

        for (let j = 0; j < row.length; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'matrix-cell';

            const output = document.createElement('output');
            output.type = 'text';
            output.className = 'form-control matrix-output';
            output.value = row[j];

            cellDiv.appendChild(output);
            rowDiv.appendChild(cellDiv);
        }

        container.appendChild(rowDiv);
    }
}

// Hàm hiển thị thông báo trạng thái
function displayStatusMessage(message) {
    const statusMessageContainer = document.getElementById('statusMessage');
    statusMessageContainer.innerHTML = message;

    // Hiển thị hoặc ẩn thông báo dựa vào giá trị của biến displayMessage
    statusMessageContainer.style.display = displayMessage ? 'block' : 'none';
}

// Hàm delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Hàm chuyển vị ma trận
async function transposeMatrix(matrix, containerId) {
    const soHang = matrix.length;
    const soCot = matrix[0].length || 0;
    isTransposing = true;

    // Thay đổi sự hiển thị của nút "Tạm dừng"
    const pauseResumeButton = document.getElementById('pauseResumeButton');
    pauseResumeButton.style.display = 'inline-block';
    transposedMatrixResult  = Array.from({ length: soCot }, () => Array(soHang).fill(0));

    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue').innerText;

    for (let i = 0; i < soHang; i++) {
        for (let j = 0; j < soCot; j++) {
            const inputValue = matrix[i][j];
            // Thêm kiểm tra trạng thái dừng vào vòng lặp
            if (stopTransposingFlag) {
                stopTransposingFlag = false;
                isTransposing = false;
                return; // Dừng vòng lặp khi nhận được yêu cầu dừng
            }
            if (transposedMatrixResult [j] && transposedMatrixResult [j].length > i) {
                transposedMatrixResult [j][i] = inputValue;
            }

            displayMatrix(transposedMatrixResult , containerId);

            const inputIndex = i * soCot + j;
            const outputIndex = j * soHang + i;

            // Thêm class flash cho input và output của ma trận 
            if (document.querySelectorAll('.matrix-output')[outputIndex]) {
                document.querySelectorAll('.matrix-output')[outputIndex].classList.add('flash');
            }
            if (document.querySelectorAll('.matrix-input.transposed')[inputIndex]) {
                document.querySelectorAll('.matrix-input.transposed')[inputIndex].classList.add('flash');
            }

            await moveSingleElement(i, j, soHang, soCot, speed);

            // Thay đổi tốc độ dựa trên giá trị của thanh trượt
            const currentSpeed = parseInt(speedSlider.value);
            
            await sleep(currentSpeed);

            if (document.querySelectorAll('.matrix-output')[outputIndex]) {
                document.querySelectorAll('.matrix-output')[outputIndex].classList.remove('flash');
            }
            if (document.querySelectorAll('.matrix-input.transposed')[inputIndex]) {
                document.querySelectorAll('.matrix-input.transposed')[inputIndex].classList.remove('flash');
            }

            // Kiểm tra trạng thái tạm dừng và đợi nếu cần
            while (isPaused) {
                await sleep(500);
            }
        }
    }
    // Thay đổi sự hiển thị của nút "Tạm dừng" khi hoàn thành chuyển vị
    pauseResumeButton.style.display = 'none';
    isTransposing = false;
    // Hiển thị ma trận chuyển vị tại đây
    displayMatrix(transposedMatrixResult , containerId);
    // Đặt giá trị của isTransposing là false sau khi hoàn thành chuyển vị
    isTransposing = false;
    // Hiển thị thông báo khi hoàn thành chuyển vị (nếu không bị dừng)
    if (!stopTransposingFlag) {
        displayMessage = true;
        displayStatusMessage('Đã thực hiện chuyển vị thành công.');
    }
    stopTransposingFlag = false;
}

// hiệu ứng di chuyển
async function moveSingleElement(rowIndex, colIndex, soHang, soCot) {
    // Di chuyển phần tử từ ma trận gốc sang ma trận chuyển vị
    const matrixA = document.querySelectorAll('.matrix-input');
    const matrixB = document.querySelectorAll('.matrix-output');

    const sourceIndex = rowIndex * soCot + colIndex;
    const destinationIndex = colIndex * soHang + rowIndex;

    const sourceCell = matrixA[sourceIndex];
    const destinationCell = matrixB[destinationIndex];
    //await sleep(500 / speed); // Điều chỉnh thời gian sleep dựa trên giá trị tốc độ

    // Kiểm tra xem phần tử nguồn và đích có giá trị khác undefined không
    if (sourceCell && destinationCell) {
        const inputValue = sourceCell.value;

        sourceCell.innerText = '';

        // Ẩn giá trị của phần tử trong ma trận chuyển vị
        destinationCell.style.visibility = 'hidden';

        const clone = sourceCell.cloneNode(true);
        clone.classList.remove('flash');
        clone.style.position = 'absolute';
        clone.style.top = sourceCell.offsetTop + 'px';
        clone.style.left = sourceCell.offsetLeft + 'px';

        document.body.appendChild(clone);

        sourceCell.style.opacity = 0;

        await new Promise(resolve => {
            // Thay đổi tốc độ dựa trên giá trị của thanh trượt

            const animationDuration = parseInt(speedSlider.value);;
            const startTime = Date.now();

            function move() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                const top = sourceCell.offsetTop + (destinationCell.offsetTop - sourceCell.offsetTop) * progress;
                const left = sourceCell.offsetLeft + (destinationCell.offsetLeft - sourceCell.offsetLeft) * progress;

                clone.style.top = top + 'px';
                clone.style.left = left + 'px';

                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    // Hiển thị giá trị của phần tử trong ma trận chuyển vị sau khi di chuyển
                    destinationCell.style.visibility = 'visible';
                    clone.remove();
                    destinationCell.classList.add('fade-in');
                    sourceCell.style.opacity = 1;
                    resolve();
                }
            }

            move();
        });
    }
}

// Nút chuyển vị
async function performTranspose() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrixContainer = document.getElementById('matrixContainer');
    const inputs = matrixContainer.querySelectorAll('.matrix-input');

    if (isTransposing) {
        alert('Đang trong quá trình chuyển vị. Vui lòng đợi cho đến khi hoàn thành.');
        return;
    }
    if (currentRows === 0 || currentCols === 0) {
        alert('Vui lòng tạo ma trận trước khi thực hiện chuyển vị.');
        return;
    }
    // Kiểm tra xem đã chuyển vị thành công hay chưa
    if (displayMessage) {
        // Nếu đã chuyển vị, đặt lại biến để chuẩn bị cho lần chuyển vị mới
        displayMessage = false;
        displayStatusMessage('');
    }
    if (currentRows !== 0 && currentCols !== 0 && (currentRows !== rows || currentCols !== cols)) {
        const confirmReset = confirm('Bạn đã thay đổi số dòng hoặc số cột vui lòng tạo lại ma trận mới!');
        if (!confirmReset) {
            return;
        }
        matrixContainer.innerHTML = '';
        document.getElementById('transposedMatrixContainer').innerHTML = '';
        // Ẩn thông báo khi tạo lại ma trận mới
        displayMessage = false;
        displayStatusMessage('');
    }

    for (const input of inputs) {
        if (!input.value.trim()) {
            alert('Vui lòng nhập đầy đủ giá trị cho tất cả ô trong ma trận.');
            return;
        }
    }

    const maTran = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        const cells = matrixContainer.querySelectorAll(`#row_${i} .matrix-input`);

        for (let j = 0; j < cols; j++) {
            const value = parseInt(cells[j].value) || 0;
            row.push(value);
        }

        maTran.push(row);
    }

    // Hiển thị ma trận gốc
    displayMatrix(maTran, 'transposedMatrixContainer');
    currentRows = rows;
    currentCols = cols;
    // Đặt giá trị của isTransposing là true trước khi bắt đầu chuyển vị
    isTransposing = true;

    // Thực hiện chuyển vị
    await transposeMatrix(maTran, 'transposedMatrixContainer');

    // Đặt giá trị của isTransposing là false sau khi hoàn thành chuyển vị
    isTransposing = false;

    stopTransposingFlag = false;

}

// tạo ma trận
function createMatrix() {
    // Kiểm tra xem có đang trong quá trình reset hay không
    if (isResetting) {
        alert('Đang trong quá trình reset. Vui lòng đợi cho đến khi hoàn thành.');
        return;
    }
    displayMessage = false;
    stopTransposingFlag = false;
    // Kiểm tra xem có đang trong quá trình chuyển vị hay không
    if (isTransposing) {
        alert('Đang trong quá trình chuyển vị. Vui lòng đợi cho đến khi hoàn thành.');
        return;
    }

    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    if (rows < 1 || cols < 1 || rows > 9 || cols > 9) {
        alert('Vui lòng nhập số dòng hoặc cột trong khoảng từ 1 - 9 !');
        return;
    }
    if (isNaN(rows) || isNaN(cols)) {
        alert('Vui lòng nhập số dòng và số cột!');
        return;
    }

    const matrixContainer = document.getElementById('matrixContainer');
    currentRows = rows;
    currentCols = cols;

    // Đặt giá trị của transposedMatrixResult về mảng rỗng khi tạo lại ma trận mới
    transposedMatrixResult  = [];
    matrixContainer.innerHTML = '';
    document.getElementById('transposedMatrixContainer').innerHTML = '';

    // Ẩn thông báo khi tạo ma trận mới
    displayMessage = false;
    displayStatusMessage('');

    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        rowDiv.id = `row_${i}`;

        for (let j = 0; j < cols; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'matrix-cell';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control matrix-input';

            // Thêm class transposed cho input của ma trận chuyển vị
            input.classList.add('transposed');

            // Thêm điều kiện kiểm tra trạng thái chuyển vị trước khi cho phép sửa giá trị
            input.addEventListener('input', function (event) {
                if (isTransposing) {
                    alert('Đang trong quá trình chuyển vị. Vui lòng đợi cho đến khi hoàn thành.');
                    this.value = ''; // Đặt giá trị của ô input về rỗng
                } else {
                    this.value = this.value.replace(/[^0-9-]/g, '');
                    if (this.value.indexOf('-') > 0) {
                        this.value = this.value.replace('-', '');
                    }
                }
            });

            cellDiv.appendChild(input);
            rowDiv.appendChild(cellDiv);
        }
        matrixContainer.appendChild(rowDiv);
    }
}

