async function sprintChallenge5() {
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY 2023`;

  const learnersURL = 'http://localhost:3003/api/learners';
  const mentorsURL = 'http://localhost:3003/api/mentors';

  try {
    const [resLearners, resMentors] = await Promise.all([
      axios.get(learnersURL),
      axios.get(mentorsURL)
    ]);

    const learners = resLearners.data;
    const mentors = resMentors.data;

    const mentorLookup = mentors.reduce((acc, mentor) => {
      acc[mentor.id] = `${mentor.firstName} ${mentor.lastName}`;
      return acc;
    }, {});

    learners.forEach(learner => {
      learner.mentors = learner.mentors.map(mentorId => mentorLookup[mentorId] || 'Unknown Mentor');
    });

    document.querySelector('.info').textContent = "No learner is selected"

    createAndAppendLearnerCards(learners);
  } catch (error) {
    console.log(error.message);
  }
}

function createAndAppendLearnerCards(learners) {
  const cardsContainer = document.querySelector('.cards');
  learners.forEach(learner => {
    const card = createLearnerCard(learner);
    cardsContainer.appendChild(card);
  });

  attachEventListenerToCardsContainer(cardsContainer);
}

function createLearnerCard(learner) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <h3>${learner.fullName} <span class="learner-id" style="visibility: hidden;">, ${learner.id}</span></h3>
    <div>${learner.email}</div>
    <h4 class="closed">Mentors</h4>
    <ul style="display: none;">${learner.mentors.map(mentorName => `<li>${mentorName}</li>`).join('')}</ul>
  `;

  const mentorsHeader = card.querySelector('h4');
  const mentorsList = card.querySelector('ul');
  mentorsHeader.addEventListener('click', (event) => {
    event.stopPropagation();
    mentorsHeader.classList.toggle('closed');
    mentorsList.style.display = mentorsList.style.display === 'none' ? 'block' : 'none';
  });

  return card;
}

function attachEventListenerToCardsContainer(container) {
  container.addEventListener('click', function(event) {
    const card = event.target.closest('.card');
    if (!card) return; // Click wasn't on or inside a card

    const isSelected = card.classList.contains('selected');
    document.querySelectorAll('.card').forEach(c => {
      c.classList.remove('selected');
      c.querySelector('.learner-id').style.visibility = 'hidden';
      c.querySelector('h4').classList.add('closed');
      c.querySelector('ul').style.display = 'none'; 
    });

    document.querySelector('.info').textContent = "No learner is selected";

    if (!isSelected) {
      card.classList.add('selected');
      card.querySelector('.learner-id').style.visibility = 'visible';

      const learnerName = card.querySelector('h3').textContent.split(',')[0];
      document.querySelector('.info').textContent = `The selected learner is ${learnerName}`;
    }
  });
}

// ❗ DO NOT CHANGE THE CODE BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 };
else sprintChallenge5();
