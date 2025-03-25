const QUESTIONS = [
    {
        label: 'Sizin için en uygun çalışma türü nedir?',
        answers: ['Tam zamanlı', 'Yarı zamanlı', 'Serbest çalışma', 'Uzaktan çalışma'],
    },
    {
        label: 'Günde ne kadar süre çalışmaya hazırsınız?',
        answers: ['2-4 saat', '4-6 saat', '6-8 saat', '8 saat ve üzeri'],
    },
    {
        label: 'Bilgisayar beceri seviyeniz nedir?',
        answers: ['Temel', 'Orta', 'İleri', 'Uzman'],
    },
    {
        label: 'Üniversite diplomanız var mı?',
        answers: ['Evet', 'Hayır', 'Devam ediyorum', 'Ön lisans'],
    },
    {
        label: 'Hangi alanlarda çalışmaktan keyif alırsınız?',
        answers: [
            'Teknoloji ve yazılım',
            'Sanat ve tasarım',
            'Eğitim ve öğretim',
            'Sağlık ve bakım',
            'Diğer',
        ],
    },
    {
        label: 'Hangi çalışma ortamını tercih edersiniz?',
        answers: ['Ofis ortamı', 'Uzaktan çalışma', 'Saha çalışması', 'Bağımsız çalışma'],
    },
    {
        label: 'Meslek seçiminizde en önemli faktör nedir?',
        answers: [
            'Maaş ve kariyer fırsatları',
            'Esneklik ve iş dengesi',
            'Kendi ilgi alanlarım',
            'İş güvenliği',
        ],
    },
    {
        label: 'Yeni bir meslek öğrenmeye ne kadar isteklisiniz?',
        answers: ['Çok istekliyim', 'Orta derecede istekliyim', 'Az istekliyim', 'İlgilenmiyorum'],
    },
    {
        label: 'Hangi iş becerilerine sahipsiniz?',
        answers: [
            'İletişim ve liderlik',
            'Problem çözme ve analitik düşünme',
            'Yaratıcılık ve yenilikçilik',
            'Teknik ve pratik yetenekler',
        ],
    },
    {
        label: 'Şu anda bir işiniz var mı?',
        answers: ['Evet, memnunum', 'Evet, ama değiştirmek istiyorum', 'Hayır, iş arıyorum', 'Öğrenciyim'],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <img class="quiz-img" src="img/quiz.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <h2 class="title">Mesleğinizi Değiştirmeye Hazır mısınız?</h2>
                    <h3 class="sub-title">Soruları Yanıtlayın ve Sizin İçin Uygun Meslekleri Öğrenin</h3>
                    <p class="text">İlgi alanlarınıza ve becerilerinize en uygun meslekleri keşfetmek için bu kısa anketi doldurun.</p>
                    <button class="btn btn-primary w-100 py-3 first-button" data-action="startQuiz">Başla</button>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
        <div class="container quiz-wrapper">

            <div class="row quiz-content text-center">

                <div class="row justify-content-center mt-4" style="margin: 0 auto;">
                    <div class="progress col-md-6" style="padding-left: 0 !important; padding-right: 0 !important;">
                        <div class="progress-bar" style="width: ${questionsStep.getProgress()}%">${questionsStep.getProgress()}%</div>
                    </div>
                </div>

                <h3>${question.label}</h3>

                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `
                                <button class="answer col-md-12 col-lg-5 border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>
                            `,
                        )
                        .join('')}
                </div>

                <div class="row mt-4" style="display: flex;justify-content: center;">
                    ${questionsStep.questionIndex > 0 
                        ? `<button style="color: #fff; background: #729eb3; border-color: #729eb3" class="btn btn-primary col-md-5 mx-2" data-action="goToPreviousQuestion">Geri Dön</button>` 
                        : ''}
                </div>

            </div>
        </div>
      `;
    },
    getProgress: () =>
        Math.floor((questionsStep.questionIndex / QUESTIONS.length) * 100),
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'goToPreviousQuestion':
                return questionsStep.goToPreviousQuestion();
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    goToPreviousQuestion: () => {
        if (questionsStep.questionIndex > 0) {
            questionsStep.questionIndex -= 1;
            questionsStep.render();
        }
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content form-content">
                <div class="col-lg-6 col-md-6 col-sm-12 form-block">
                    <h2 class="title">İletişim Formu</h2>
                    <h3 class="mb-4">Lütfen geri bildirim formunu doldurun</h3>
                    <form id="contact-form">
                        <input class="form-control" name="email" id="email" type="email" placeholder="E-Posta" required>
                        <button type="submit" class="btn btn-primary w-100 py-3 first-button">Gönder</button>
                    </form>
                </div>
            </div>
        </div>
      `;

        document.getElementById("contact-form").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission
            localStorage.setItem('quizDone', true);
            document.getElementById('main-page').classList.remove('hide');
            document.getElementById('quiz-page').classList.add('hide');
            document.getElementById('footer').classList.add('hide');
            window.location.href = 'thanks.html'; // Redirect after handling
        });
    }
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    document.getElementById('main-page').classList.add('hide');
    quiz.init();
    quiz.render();
}
