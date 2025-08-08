// Dropdown workout selection
let select = document.querySelector(".select-heading");
let arrow = document.querySelector(".select-heading img");
let options = document.querySelector(".options");
let optionItems = document.querySelectorAll(".option");
let selecttext = document.querySelector(".select-heading span");

let fuse;
let fitnessDataset = [];

// Load JSON dataset
fetch('fitness_qa_dataset.json')
  .then(response => response.json())
  .then(data => {
    fitnessDataset = data;
    fuse = new Fuse(fitnessDataset, {
      keys: ['question'],
      threshold: 0.4 // Allows loose matching
    });
  });

let fitnessQA = [];

fetch("data/fitness_qa_dataset.json")
  .then((res) => res.json())
  .then((data) => {
    fitnessQA = data;
    console.log("Fitness Q&A loaded!", fitnessQA);
  })
  .catch((err) => console.error("Failed to load dataset", err));



select.addEventListener("click", () => {
  options.classList.toggle("active-options");
  arrow.classList.toggle("rotate");
});

optionItems.forEach((item) => {
  item.addEventListener("click", () => {
    selecttext.innerText = item.innerText;
  });
});

function hideAllSections() {
  document.querySelectorAll('.workout-plan-section, .bmi-section, .calorie-section, .fitness-tip-section, .diet-plan-section, .calorie-burn-section')
  .forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById("bmi-result").innerText = "";
  document.getElementById("calorie-result").innerText = "";
  document.getElementById("workout-plan-result").innerText = "";
  document.getElementById("burn-result").innerText = "";
  document.getElementById("fitness-tip-result").innerText = "";
  document.getElementById("diet-plan-result").innerText = "";
}

// Chatbot
let promptInput = document.querySelector(".prompt");
let chatbtn = document.querySelector(".input-area button");
let chatContainer = document.querySelector(".chat-container");
let h1 = document.querySelector(".h1");
let chatimg = document.querySelector("#chatbotimg");
let chatbox = document.querySelector(".chat-box");

let userMessage = "";
chatimg.addEventListener("click", () => {
  chatbox.classList.toggle("active-chat-box");
  chatimg.src = chatbox.classList.contains("active-chat-box") ? "cross.svg" : "chatbot.svg";
});

let Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAcbZcps2Asx69uRSoJtCEKCpPzjaY78PY";

async function generateApiResponse(aiChatBox) {
  const textElement = aiChatBox.querySelector(".text");
  try {
    const response = await fetch(Api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${userMessage} in 10 words` }] }]
      })
    });
    const data = await response.json();
    const apiResponse = data?.candidates[0].content.parts[0].text.trim();
    textElement.innerText = apiResponse;
    speak(apiResponse);
  } catch (error) {
    console.log(error);
  } finally {
    aiChatBox.querySelector(".loading").style.display = "none";
  }
}

function createChatBox(html, className) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.innerHTML = html;
  return div;
}

function showLoading() {
  const html = `<p class="text"></p><img src="load.gif" class="loading" width="50px">`;
  let aiChatBox = createChatBox(html, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);
  generateApiResponse(aiChatBox);
}

chatbtn.addEventListener("click", () => {
  h1.style.display = "none";
  userMessage = promptInput.value;
  const html = `<p class="text"></p>`;
  let userChatBox = createChatBox(html, "user-chat-box");
  userChatBox.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(userChatBox);
  promptInput.value = "";
  setTimeout(showLoading, 500);
});

// Voice Assistant
let ai = document.querySelector(".virtual-assistant img");
let speakpage = document.querySelector(".speak-page");
let content = document.querySelector(".speak-page h1");

function speak(text) {
  let text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.volume = 1;
  text_speak.lang = "en-GB";
  window.speechSynthesis.speak(text_speak);
}

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = (event) => {
  speakpage.style.display = "none";
  let transcript = event.results[event.resultIndex][0].transcript;
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};
recognition.onerror = function(event) {
  speakpage.style.display = "none";
  alert("Voice assistant error: " + event.error);
};

ai.addEventListener("click", () => {
  recognition.start();
  speakpage.style.display = "flex";
});

// Final combined Voice Command handler
function takeCommand(message) {
  if (message.includes("open chat")) {
    speak("okay");
    chatbox.classList.add("active-chat-box");

  } else if (message.includes("close chat")) {
    speak("okay");
    chatbox.classList.remove("active-chat-box");

  } else if (message.includes("back workout")) {
    speak("opening back workout");
    window.open("back.html", "_self");

  } else if (message.includes("chest workout")) {
    speak("opening chest workout");
    window.open("chest.html", "_self");


  } else if (message.includes("biceps") || message.includes("triceps")) {
    speak("opening biceps and triceps workout");
    window.open("biceps-triceps.html", "_self");

  } else if(message.includes("workout plan")){
    document.querySelector(".workout-plan-section").style.display = "block";
    speak("Here is your workout plan generator.");
  
  } else if(message.includes("body mass index")){
    hideAllSections();
    document.querySelector(".bmi-section").style.display = "block";
    speak("Here is your BMI calculator.");

  } else if(message.includes("calorie requirement estimator")){
    hideAllSections();
    document.querySelector(".calorie-section").style.display = "block";
    speak("Here is your calorie requirement estimator.");
  
  } else if(message.includes("fitness tip")){
    hideAllSections();
    document.querySelector(".fitness-tip-section").style.display = "block";
    speak("Here is your fitness tip for the day.");
    showFitnessTip();

  } else if(message.includes("diet plan")){
    hideAllSections();
    document.querySelector(".diet-plan-section").style.display = "block";
    speak("Here is your diet plan suggestion.");
  
  } else if(message.includes("calories burned") || message.includes("burn estimator")){
    hideAllSections();
    document.querySelector(".calorie-burn-section").style.display = "block";
    speak("Here is your calories burned estimator.");
  
  } else if(message.includes("open dashboard") || message.includes("show dashboard")){
    hideAllSections();
    document.querySelector(".fitness-dashboard").style.display = "block";
    speak("Here is your fitness tools dashboard.");
  
  } else if (message.includes("shoulder workout")) {
    speak("opening shoulder workout");
    window.open("shoulder.html", "_self");

  } else if (message.includes("leg workout")) {
    speak("opening leg workout");
    window.open("leg.html", "_self");

  } else if (message.includes("open youtube")) {
    speak("opening YouTube");
    window.open("https://youtube.com/", "_blank");

  } else if (message.includes("open google")) {
    speak("opening Google");
    window.open("https://google.com/", "_blank");

  } else if (message.includes("open instagram")) {
    speak("opening Instagram");
    window.open("https://instagram.com/", "_blank");

  } else if (message.includes("open facebook")) {
    speak("opening Facebook");
    window.open("https://facebook.com/", "_blank");

  } else if (message.includes("open calculator")) {
    speak("opening calculator");
    window.open("https://www.online-calculator.com/", "_blank");

  } else if (message.includes("hello") || message.includes("hey")) {
    speak("hello sir, what can I help you with?");

  } else if (message.includes("who are you")) {
    speak("I am your virtual assistant");

  } else if (message.includes("what is the time")) {
    let time = new Date().toLocaleTimeString();
    speak(`The time is ${time}`);

  } else if (message.includes("what is the date")) {
    let date = new Date().toLocaleDateString();
    speak(`Today's date is ${date}`);

  }
 
   
  else {
  // Fuzzy search logic
   const result = fuse.search(message);
   if (result.length > 0) {
   const bestAnswer = result[0].item.answer;
   speak(bestAnswer);
  } else {
   speak("I'm not sure, but I can try to find out.");
}


  // Send the unknown voice command to the chatbot system
  userMessage = message;

  const html = `<p class="text"></p>`;
  let userChatBox = createChatBox(html, "user-chat-box");
  userChatBox.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(userChatBox);
  promptInput.value = ""; // clear input
  h1.style.display = "none";
  setTimeout(showLoading, 500);
}

}

function generateWorkout() {
  const group = document.getElementById("muscle-group").value;
  let plan = "";

  switch (group.toLowerCase()) {
    case "legs":
      plan = "Squats, Lunges, Leg Press, Calf Raises";
      break;
    case "chest":
      plan = "Push-Ups, Bench Press, Dumbbell Fly, Chest Dips";
      break;
    case "back":
      plan = "Pull-Ups, Deadlifts, Bent Over Rows, Lat Pulldowns";
      break;
    case "shoulders":
      plan = "Overhead Press, Lateral Raises, Front Raises, Shrugs";
      break;
    case "arms":
      plan = "Barbell Curls, Hammer Curls, Tricep Dips, Concentration Curls";
      break;
    default:
      plan = "Please select a muscle group.";
  }

  document.getElementById("workout-plan-result").innerText = plan;
}
function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (!height || !weight) {
    document.getElementById("bmi-result").innerText = "Please enter valid numbers.";
    return;
  }

  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
  let category = "";

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi >= 18.5 && bmi < 24.9) {
    category = "Normal";
  } else if (bmi >= 25 && bmi < 29.9) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  document.getElementById("bmi-result").innerText = `Your BMI is ${bmi} (${category})`;
}

 
function savePreferences() {
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  if (!height || !weight) {
    alert("Please fill both fields before saving.");
    return;
  }

  // Save preferences to localStorage
  localStorage.setItem("userHeight", height);
  localStorage.setItem("userWeight", weight);

  alert("Preferences saved successfully!");
}


function calculateCalories() {
  const age = parseFloat(document.getElementById("age").value);
  const height = parseFloat(document.getElementById("cal-height").value);
  const weight = parseFloat(document.getElementById("cal-weight").value);
  const gender = document.getElementById("gender").value;
  const activity = parseFloat(document.getElementById("activity").value);

  if (!age || !height || !weight || !gender || !activity) {
    document.getElementById("calorie-result").innerText = "Please fill all fields.";
    return;
  }

  let bmr = 0;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const totalCalories = Math.round(bmr * activity);

  document.getElementById("calorie-result").innerText =
    `Your estimated daily calorie requirement is ${totalCalories} kcal.`;
}

const fitnessTips = [
  "Drink enough water every day to stay hydrated.",
  "Warm up before and stretch after your workouts.",
  "Mix cardio with strength training for better results.",
  "Eat balanced meals with proteins, carbs, and healthy fats.",
  "Get at least 7-8 hours of sleep daily.",
  "Be consistent — small efforts daily lead to big results.",
  "Never skip your rest days for muscle recovery.",
  "Track your fitness progress regularly to stay motivated.",
  "Start your day with a light warmup and stretching.",
  "Don’t exercise immediately after a heavy meal."
];

function showFitnessTip() {
  const randomIndex = Math.floor(Math.random() * fitnessTips.length);
  document.getElementById("fitness-tip-result").innerText = fitnessTips[randomIndex];
}

function showDietPlan() {
  const goal = document.getElementById("goal").value;
  let plan = "";

  if (goal === "weight loss") {
    plan = `- Breakfast: Oats with fruits  
- Lunch: Grilled chicken with salad  
- Evening Snack: Nuts & green tea  
- Dinner: Steamed veggies and soup`;
  } else if (goal === "muscle gain") {
    plan = `- Breakfast: Eggs, toast & milk  
- Lunch: Brown rice with chicken  
- Evening Snack: Protein shake & banana  
- Dinner: Paneer/tofu and roti`;
  } else if (goal === "maintenance") {
    plan = `- Breakfast: Idli or poha  
- Lunch: Rice with dal and veggies  
- Evening Snack: Fruits or sprouts  
- Dinner: Chapati with sabzi`;
  }

  document.getElementById("diet-plan-result").innerText = plan;
}

function estimateCaloriesBurned() {
  const activity = document.getElementById("activity-type").value;
  const duration = parseFloat(document.getElementById("duration").value);
  let caloriesPerMinute = 0;

  if (!duration || duration <= 0) {
    document.getElementById("burn-result").innerText = "Please enter valid duration.";
    return;
  }

  switch (activity) {
    case "running":
      caloriesPerMinute = 10; // per minute
      break;
    case "cycling":
      caloriesPerMinute = 8;
      break;
    case "walking":
      caloriesPerMinute = 5;
      break;
    case "yoga":
      caloriesPerMinute = 3;
      break;
    default:
        document.getElementById("burn-result").innerText = "Activity type not recognized.";
        return;

  }

  const totalCalories = caloriesPerMinute * duration;

  document.getElementById("burn-result").innerText = 
    `You burned approximately ${totalCalories} kcal doing ${activity} for ${duration} minutes.`;
}
 
function startWorkoutTimer() {
  const name = document.getElementById("exerciseName").value;
  const sets = parseInt(document.getElementById("sets").value);
  const rest = parseInt(document.getElementById("rest").value);
  const display = document.getElementById("timer-display");

  if (!name || !sets || !rest) {
    display.innerText = "Please fill all fields.";
    return;
  }

  let currentSet = 1;

  function doSet() {
    if (currentSet > sets) {
      speak(`Workout complete. Great job!`);
      display.innerText = "Workout complete!";
      return;
    }

    speak(`Start set ${currentSet} of ${name}`);
    display.innerText = `Set ${currentSet} - GO!`;

    setTimeout(() => {
      speak(`Rest for ${rest} seconds`);
      display.innerText = `Resting...`;

      setTimeout(() => {
        currentSet++;
        doSet();
      }, rest * 1000);
    }, 5000); // 5 sec work per set
  }

  doSet();
}
