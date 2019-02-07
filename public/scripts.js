const phone = document.querySelector('input')
const submit = document.querySelector('button')
const insights = document.querySelector('code')

submit.addEventListener('click', send, false)
phone.addEventListener('keydown', enter, false)

function send(event) {
  fetch('/submit', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone: phone.value
    })
  })
  .then(function(res) {
    if (res.status === 202) {
      return res.text()
    } else {
      return res.json()
    }
  })
  .then(function(insight) { parseInsight(insight) })
  .catch(function(error){ console.log(error) })
}

function enter(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    send()
  }
}

function parseInsight(data) {
  if (typeof data === 'string') {
    insights.innerHTML = data
  } else {
    insights.innerHTML = JSON.stringify(data, null, 2)
  }
}