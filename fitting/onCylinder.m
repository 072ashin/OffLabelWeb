function r = onCylinder(centroids, normals, cylinder_axis, cylinder_point, cylinder_radius, DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD)
% This function check if a set of 3-D points with coordinates "centroids"
% and normal vectors "normals" are on a cylinder within thresholds
    m = size(centroids, 1);
    cylinder_normal = centroids - repmat(cylinder_point, m, 1) - repmat(cylinder_axis, m, 1) .* repmat(dot(centroids - repmat(cylinder_point, m, 1), repmat(cylinder_axis, m, 1), 2), 1, 3);
    cylinder_normal = cylinder_normal ./ repmat(sqrt(sum(cylinder_normal .^ 2, 2)), 1, 3);
    r = abs(sqrt(sum((cross(centroids - repmat(cylinder_point, m, 1), repmat(cylinder_axis, m, 1), 2)) .^ 2, 2)) - cylinder_radius) <= DISTANCE_THRESHOLD & abs(dot(normals, cylinder_normal, 2)) >= NORMAL_DEVIATION_THRESHOLD;
end
