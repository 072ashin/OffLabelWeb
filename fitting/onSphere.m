function r = onSphere(centroids, normals, sphere_center, sphere_radius, DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD)
% This function check if a set of 3-D points with coordinates "centroids"
% and normal vectors "normals" are on a sphere within thresholds
    m = size(centroids, 1);
    r = abs(sqrt(sum((centroids - repmat(sphere_center, m, 1)) .^ 2, 2)) - repmat(sphere_radius, m, 1))  <= DISTANCE_THRESHOLD & abs(dot(normals, (centroids - repmat(sphere_center, m, 1)) ./ repmat(sqrt(sum((centroids - repmat(sphere_center, m, 1)) .^ 2, 2)), 1, 3), 2)) >= NORMAL_DEVIATION_THRESHOLD;
end