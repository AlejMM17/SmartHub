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
  const fetchActivity = async (activityId) => {
    setLoading(true);
    setError(null);

    try {
      if (!activityId) {
        throw new Error("Activity ID is required");
      }

      const res = await fetch(`http://localhost:3001/api/v1/activities/${activityId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch activity with ID: ${activityId}`
        );
      }

      const activity = await res.json();
      return activity;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const postActivity = async (activityStructure) => {
    setLoading(true);
    setError(null);
  
    try {
      if (!activityStructure) throw new Error('No activity structure provided');
  
      const formData = new FormData();
      formData.append("name", activityStructure.name);
      formData.append("description", activityStructure.description);
      formData.append("start_date", activityStructure.start_date);
      formData.append("end_date", activityStructure.end_date);
  
      if (activityStructure.activity_picture) {
        formData.append("activity_picture", activityStructure.activity_picture);
      }
  
      activityStructure.skills.forEach((skill, index) => {
        formData.append(`skills[${index}][skill_id]`, skill.skill_id);
        formData.append(`skills[${index}][percentage]`, skill.percentage);
      });
  
      const res = await fetch("http://localhost:3001/api/v1/activities", {
        method: "POST",
        body: formData
      });
  
      if (!res.ok) {
        throw new Error("Failed to create activity");
      }
  
      return await res.json();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    setLoading(true);
    setError(null);

    try {
        if (!id) throw new Error('No ID provided')

        const res = await fetch(`http://localhost:3001/api/v1/activities/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`Failed to delete activity with id: ${id}`);
        }

        return res.json();

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}
  const updateActivity = async (id, activity) => {
    setLoading(true);
    setError(null);
    try {
      if (!id) throw new Error('No ID provided');

      const formData = new FormData();
      if (activity.name) formData.append("name", activity.name);
      if (activity.description) formData.append("description", activity.description);
      if (activity.start_date) formData.append("start_date", activity.start_date);
      if (activity.end_date) formData.append("end_date", activity.end_date);

      if (activity.activity_picture) {
        formData.append("activity_picture", activity.activity_picture);
      }

      if (activity.skills) {
        activity.skills.forEach((skill, index) => {
          formData.append(`skills[${index}][skill_id]`, skill.skill_id);
          formData.append(`skills[${index}][percentage]`, skill.percentage);
        });
      }

      const res = await fetch(`http://localhost:3001/api/v1/activities/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Failed to update activity with id: ${id}`);
      }

      return await res.json();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchActivities, fetchActivity, postActivity, deleteActivity, updateActivity, error, loading };
}

