std_msgs/Header header
string execution_id
string action_graph_id
string robot_id
string status  # PENDING, EXECUTING, COMPLETED, FAILED, CANCELLED
string current_action_id
ActionResult[] results
string error_message
builtin_interfaces/Time started_at
builtin_interfaces/Time completed_at
float64 total_duration_seconds

