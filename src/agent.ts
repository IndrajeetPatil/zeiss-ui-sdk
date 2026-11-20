import { createAgent, registerTools } from "@ui-sdk/react/agent";

const agent = createAgent({
  allow: (step) => (step.confirm ? window.confirm(step.confirm) : true),
});

function connectAgent() {
  registerTools(agent, { allow: () => true });
}

export { agent, connectAgent };
