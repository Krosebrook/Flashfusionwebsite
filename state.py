from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from threading import Lock
from typing import Dict, Any, List, Optional


@dataclass(frozen=True)
class StateUpdate:
    """
    Immutable record of a state update by an agent.

    Attributes:
        agent_id: Identifier of the agent performing the update.
        timestamp: When the update occurred.
        update_type: Category of update (e.g. 'task_completion', 'analysis').
        data: Key/value pairs modified.
        version: Monotonic version number of the state after the update.
    """

    agent_id: str
    timestamp: datetime
    update_type: str
    data: Dict[str, Any]
    version: int


class CentralizedStateManager:
    """
    Thread-safe versioned state manager for multi-agent workflows.
    """

    def __init__(self) -> None:
        self._state: Dict[str, Any] = {}
        self._version: int = 0
        self._history: List[StateUpdate] = []
        self._checkpoints: Dict[int, Dict[str, Any]] = {}
        self._lock = Lock()

    def read_state(self, keys: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Return a copy of the current state, optionally limited to specified keys.
        """
        with self._lock:
            if keys is not None:
                return {k: self._state.get(k) for k in keys}
            return dict(self._state)

    def update_state(
        self,
        agent_id: str,
        updates: Dict[str, Any],
        update_type: str = "standard",
    ) -> int:
        """
        Apply updates atomically to the state and record a new version.

        Args:
            agent_id: The agent performing the update.
            updates: The key/value pairs to merge into the state.
            update_type: A label describing the kind of update.

        Returns:
            The new version number after the update.
        """
        with self._lock:
            self._version += 1
            update_record = StateUpdate(
                agent_id=agent_id,
                timestamp=datetime.now(),
                update_type=update_type,
                data=dict(updates),
                version=self._version,
            )
            self._state.update(updates)
            self._history.append(update_record)
            return self._version

    def create_checkpoint(self, checkpoint_name: str) -> int:
        """
        Save a named snapshot of the state.

        Returns the version number at which the checkpoint was created.
        """
        with self._lock:
            version = self._version
            self._checkpoints[version] = {
                "name": checkpoint_name,
                "state": dict(self._state),
                "timestamp": datetime.now(),
            }
            return version

    def restore_checkpoint(self, version: int) -> bool:
        """
        Restore the state to a previously saved checkpoint.

        Returns True if successful, False if the checkpoint is unknown.
        """
        with self._lock:
            checkpoint = self._checkpoints.get(version)
            if not checkpoint:
                return False
            self._state = dict(checkpoint["state"])
            self._version = version
            return True

    def get_history(
        self,
        agent_id: Optional[str] = None,
        since_version: Optional[int] = None,
    ) -> List[StateUpdate]:
        """
        Return a list of state updates, optionally filtered by agent or version.
        """
        with self._lock:
            history = list(self._history)
            if agent_id is not None:
                history = [u for u in history if u.agent_id == agent_id]
            if since_version is not None:
                history = [u for u in history if u.version > since_version]
            return history

    def get_agent_contributions(self) -> Dict[str, int]:
        """
        Return a count of updates performed by each agent.
        """
        with self._lock:
            counts: Dict[str, int] = {}
            for update in self._history:
                counts[update.agent_id] = counts.get(update.agent_id, 0) + 1
            return counts