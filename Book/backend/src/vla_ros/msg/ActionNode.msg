string id
string type  # NAVIGATE, GRASP, PLACE, PERCEPTION_QUERY, WAIT, CUSTOM
string[] dependencies
string parameters_json  # JSON string of parameters
string outputs_json    # JSON string of expected outputs
SafetyConstraint[] constraints
float64 estimated_duration_seconds

