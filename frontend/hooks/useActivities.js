import { useState } from "react";

export default function useActivities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = async (projectId) => {
    setLoading(true);
    setError(null);

    try {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const res = await fetch(`http://localhost:3001/api/v1/activities/project/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch activities for project with ID: ${projectId}`
        );
      }

      const activities = await res.json();
      return activities;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchActivities, error, loading };
}
