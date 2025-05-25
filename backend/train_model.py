# backend/train_model.py
####################################################################################
# This script trains an epsilon-greedy bandit model based on historical data
# and writes out both a pickle model and a predicted.json summary.
# This script must NOT be rerun once the model is trained

import json
import pickle
import os
import pandas as pd
from datetime import datetime

# Base directory of this script
BASE_DIR = os.path.dirname(__file__)

# Paths (adjust if needed)
DATA_PATH      = os.path.join(BASE_DIR, "dataformodel.json")
MODEL_PATH     = os.path.join(BASE_DIR, "model.pkl")
PREDICTED_PATH = os.path.join(BASE_DIR, "predicted.json")

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
    if not os.path.exists(path):
        raise FileNotFoundError(f"Data file not found: {path}")
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

    # 2. Prepare summary dict
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

    # 3. Write summary JSON to backend
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)

    # 4. Also write summary JSON into frontend folder
    frontend_path = os.path.abspath(
        os.path.join(BASE_DIR, "..", "frontend", os.path.basename(summary_path))
    )
    os.makedirs(os.path.dirname(frontend_path), exist_ok=True)
    try:
        with open(frontend_path, "w") as f_front:
            json.dump(summary, f_front, indent=2)
    except Exception as e:
        print(f"⚠ Failed to write frontend summary: {e}")

    print(f"[{datetime.now()}] Saved pickle to {model_path}")
    print(f"[{datetime.now()}] Saved summary to {summary_path}")
    print(f"[{datetime.now()}] Also saved summary to {frontend_path}")


def main():
    try:
        df = load_history(DATA_PATH)
    except FileNotFoundError as e:
        print(e)
        return

    if df.empty:
        print("No historical data found. Exiting.")
        return

    agent = train_bandit(df)
    write_model(agent, MODEL_PATH, PREDICTED_PATH)


if __name__ == "__main__":
    main()
