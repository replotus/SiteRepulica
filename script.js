let currentDate = new Date();
const responsibles = [
    [], // Domingo (sem responsáveis)
    ["Vitoria"], // Segunda 
    ["Luisa"], // Terça
    ["Maria Clara", "Marina"], // Quarta
    ["Gabi"], // Quinta
    ["Gracielle"], // Sexta
    ["Isadora", "Isadora R."] // Sábado 
];

// Listas de cômodos
const roomsList = ["Cozinha", "Sala", "Copa", "Garagem", "Lavanderia", "Banheiro"];

// Função para obter o índice da semana atual
function getWeekIndex() {
    const firstDate = new Date(currentDate.getFullYear(), 0, 1);
    const pastDays = Math.floor((currentDate - firstDate) / (24 * 60 * 60 * 1000));
    return Math.floor(pastDays / 7); // Índice da semana
}

// Função para renderizar o calendário
function renderCalendar() {
    const monthTitle = document.getElementById('month-title');
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthTitle.textContent = `${currentDate.toLocaleString('pt-BR', { month: 'long' }).toUpperCase()} ${year}`;

    const firstDay = new Date(year, month, 1).getDay(); // Primeiro dia do mês
    const lastDate = new Date(year, month + 1, 0).getDate(); // Último dia do mês
    const weekIndex = getWeekIndex(); // Índice da semana corrente

    // Adiciona células vazias para os dias do mês anterior
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    // Adiciona os dias do mês atual
    for (let date = 1; date <= lastDate; date++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        dayCell.textContent = date;

        const currentDayOfWeek = new Date(year, month, date).getDay(); // Obtém o dia da semana (0-6)
        const responsiblesForDay = responsibles[currentDayOfWeek]; // Responsáveis para o dia

        // Verifica se há responsáveis no dia
        if (responsiblesForDay.length > 0) {
            const assignedRooms = assignRooms(weekIndex, currentDayOfWeek); // Atribui cômodos para o dia
            dayCell.onclick = () => showTasks(date, currentDayOfWeek, responsiblesForDay, assignedRooms);
        }

        calendarGrid.appendChild(dayCell);
    }

    updateCurrentDate();
}

// Função para atribuir cômodos, evitando repetições nos dias consecutivos
function assignRooms(weekIndex, currentDayOfWeek) {
    const assignedRooms = [];

    for (let i = 0; i < responsibles[currentDayOfWeek].length; i++) {
        const roomIndex = (weekIndex + i) % roomsList.length;
        assignedRooms.push(roomsList[roomIndex]);
    }

    return assignedRooms;
}

// Função para mostrar as tarefas
function showTasks(day, dayOfWeek, responsibles, assignedRooms) {
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = ''; // Limpa tarefas anteriores

    const formattedDate = `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`; // Formata a data
    for (let i = 0; i < responsibles.length; i++) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.innerHTML = `Data: ${formattedDate} - <strong>${responsibles[i]}</strong> irá limpar o Cômodo: ${assignedRooms[i]}`;

        // Criar um div para o botão
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'button-container';

        const cleanButton = document.createElement('button');
        cleanButton.className = 'limpei-button'; // Usando a classe que você forneceu
        cleanButton.setAttribute('data-cleaned', 'false');
        cleanButton.textContent = 'Limpei';

        buttonDiv.appendChild(cleanButton);
        taskDiv.appendChild(buttonDiv);
        tasksDiv.appendChild(taskDiv);
    }

    addCleanButtonsEvent();
}


// Função para obter o nome do dia da semana
function getDayName(dayIndex) {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[dayIndex];
}

// Atualiza a data atual
function updateCurrentDate() {
    const dateDiv = document.getElementById('current-date');
    dateDiv.textContent = currentDate.toLocaleDateString('pt-BR');
}

// Função para mudar o mês
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Adiciona eventos de clique nos botões
document.getElementById('prev-month').onclick = () => changeMonth(-1);
document.getElementById('next-month').onclick = () => changeMonth(1);

// Função para adicionar eventos de clique aos botões "Limpei"
function addCleanButtonsEvent() {
    const cleanButtons = document.querySelectorAll('.clean-button');

    cleanButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cleaned = this.getAttribute('data-cleaned') === 'true';
            this.setAttribute('data-cleaned', !cleaned);

            // Obtém o dia do calendário a partir do texto da tarefa
            const taskDiv = this.closest('.task'); // A div da tarefa
            const taskText = taskDiv.innerHTML; // Obtem todo o conteúdo da tarefa
            const dayText = taskText.match(/Data: (\d{1,2}\/\d{1,2}\/\d{4})/)[1]; // Captura a data do texto
            const dayNumber = parseInt(dayText.split('/')[0], 10); // Obtém o dia (ex: 1 de 01/01/2024)

            // Encontra a célula correspondente no calendário
            const dayCell = Array.from(document.querySelectorAll('.day')).find(cell => parseInt(cell.textContent) === dayNumber); 

            if (dayCell) {
                // Altera a cor do dia
                dayCell.style.backgroundColor = cleaned ? 'green' : ''; // Muda para verde se "limpei", senão volta a cor original
            }
        });

        // Verificar se o botão foi clicado após 24 horas
        setTimeout(() => {
            if (button.getAttribute('data-cleaned') === 'false') {
                button.style.backgroundColor = 'red';
            }
        }, 24 * 60 * 60 * 1000); // 24 horas
    });
}


// Chama a função para renderizar o calendário ao carregar
renderCalendar();
