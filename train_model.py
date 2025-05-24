# train_model.py
####################################################################################

# This script trains an epsilon-greedy bandit model based on historical data
# and writes out both a pickle model and a predicted.json summary.
# This script must NOT be rerun once the model is trained

import json
import pickle
import pandas as pd
from datetime import datetime

# Paths (adjust if needed)
DATA_PATH      = "dataformodel.json"
MODEL_PATH     = "model.pkl"
PREDICTED_PATH = "predicted.json"

class EpsilonGreedyAgent:
    def __init__(self, n_actions: int, epsilon: float = 0.2):
        self.epsilon = epsilon
        self.n_actions = n_actions
        self.q_values = [0.0] * n_actions
        self.counts   = [0] * n_actions
        self.dishes   = []

    def select_action(self) -> int:
        import random
        if random.random() < self.epsilon:
            return random.randrange(self.n_actions)
        return max(range(self.n_actions), key=lambda a: self.q_values[a])

    def update(self, action: int, reward: float):
        self.counts[action] += 1
        n = self.counts[action]
        # incremental average
        self.q_values[action] += (reward - self.q_values[action]) / n


def load_history(path: str) -> pd.DataFrame:
    """Load historical data into a DataFrame with columns: name, totalEarning."""
    with open(path, "r") as f:
        raw = json.load(f)
    rows = []
    for day in raw:
        for it in day.get("items", []):
            rows.append({
                "name": it.get("name"),
                "totalEarning": it.get("totalEarning", 0)
            })
    return pd.DataFrame(rows)


def train_bandit(df: pd.DataFrame, epsilon=0.2, episodes=100) -> EpsilonGreedyAgent:
    """Train an ε-greedy bandit on average earnings per dish."""
    dishes = df["name"].unique().tolist()
    agent = EpsilonGreedyAgent(n_actions=len(dishes), epsilon=epsilon)
    agent.dishes = dishes

    for _ in range(episodes):
        a = agent.select_action()
        dish = dishes[a]
        avg_reward = df[df["name"] == dish]["totalEarning"].mean()
        agent.update(a, avg_reward)

    return agent


def write_model(agent: EpsilonGreedyAgent, model_path: str, summary_path: str):
    """Serialize the trained agent and write a JSON summary of predictions."""
    # 1. Write pickle
    with open(model_path, "wb") as f:
        pickle.dump({
            "q_values": agent.q_values,
            "counts":   agent.counts,
            "dishes":   agent.dishes,
            "epsilon":  agent.epsilon
        }, f)

    # 2. Write summary JSON
    summary = {
        "trainedAt": datetime.now().isoformat(),
        "epsilon": agent.epsilon,
        "dishes": agent.dishes,
        "q_values": agent.q_values,
        "counts": agent.counts,
        "bestAction": {
            "dish": agent.dishes[int(agent.q_values.index(max(agent.q_values)))],
            "value": max(agent.q_values)
        }
    }
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)

    print(f"[{datetime.now()}] Model saved to {model_path} and summary to {summary_path}")


def main():
    df = load_history(DATA_PATH)
    if df.empty:
        print("No historical data found. Exiting.")
        return

    agent = train_bandit(df)
    write_model(agent, MODEL_PATH, PREDICTED_PATH)

if __name__ == "__main__":
    main()
