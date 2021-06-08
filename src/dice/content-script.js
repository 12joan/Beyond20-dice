console.log("Beyond20: Dice module loaded.");

async function handleRoll(request) {
  let rolls = [];

  const rollName = {
    "skill": request["skill"],
    "initiative": "Initiative",
  }[request.type] || request["name"];

  const rollNameString = rollName === undefined
    ? ""
    : `"${rollName}"`;

  const advantageString = {
    [RollType.OVERRIDE_DISADVANTAGE]: "(dis)",
    [RollType.OVERRIDE_ADVANTAGE]: "(adv)",
    [RollType.DISADVANTAGE]: "(dis)",
    [RollType.SUPER_DISADVANTAGE]: "(dis)",
    [RollType.ADVANTAGE]: "(adv)",
    [RollType.SUPER_ADVANTAGE]: "(adv)",
  }[request["advantage"]] || "";

  switch (request.type) {
    case "attack":
      if (request["rollAttack"]) {
        rolls.push(`1d20 ${request["to-hit"]} ${advantageString} ${rollNameString}`);
      }

      if (request["rollDamage"]) {
        rolls = [...rolls, ...request["damages"]];
      }

      break;

    default:
      rolls.push(`${request["roll"]} ${advantageString} ${rollNameString}`);
  }

  window.wrappedJSObject.executeDiceNotation(rolls.join("; "));
}

function handleMessage(request, sender, sendResponse) {
  console.log("Got message : ", request);

  if (request.action == "roll") {
    handleRoll(request);
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({ "action": "activate-icon" });
sendCustomEvent("disconnect");
