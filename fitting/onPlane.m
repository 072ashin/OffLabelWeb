function r = onPlane(centroids, normals, plane_point, plane_normal, DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD)
% This function check if a set of 3-D points with coordinates "centroids"
% and normal vectors "normals" are on a plane within thresholds
    m = size(centroids, 1);
    r = abs(dot(repmat(plane_normal, m, 1), centroids - repmat(plane_point, m, 1), 2))  <= DISTANCE_THRESHOLD & abs(dot(normals, repmat(plane_normal, m, 1), 2)) >= NORMAL_DEVIATION_THRESHOLD;
end