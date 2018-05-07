function r = onCone(centroids, normals, cone_apex, cone_axis, cone_angle, DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD)
% This function check if a set of 3-D points with coordinates "centroids"
% and normal vectors "normals" are on a cone within thresholds
    m = size(centroids, 1);
    p0 = repmat(cone_apex, m, 1) + repmat(cone_axis, m, 1) .* repmat(dot(centroids - repmat(cone_apex, m, 1), repmat(cone_axis, m, 1), 2), 1, 3);
    p0p1 = sqrt(sum((centroids - p0) .^ 2, 2)) * tan(cone_angle);
    p1 = p0 + repmat(cone_axis, m, 1) .* repmat(p0p1, 1, 3);
    idx = dot(p1 - p0, repmat(cone_apex, m, 1) - p0, 2) > 0;
    if (sum(idx) > 0)
        p1(idx, :) = p0(idx, :) - repmat(cone_axis, sum(idx), 1) .* repmat(p0p1(idx), 1, 3);
    end
    cone_normal = centroids - p1;
    cone_normal = cone_normal ./ repmat(sqrt(sum(cone_normal .^ 2, 2)), 1, 3);
    r = abs(sqrt(sum((cross(centroids - repmat(cone_apex, m, 1), repmat(cone_axis, m, 1), 2)) .^ 2, 2)) * cos(cone_angle) - abs(dot(centroids - repmat(cone_apex, m, 1), repmat(cone_axis, m, 1), 2)) * sin(cone_angle)) <= DISTANCE_THRESHOLD & abs(dot(normals, cone_normal, 2)) >= NORMAL_DEVIATION_THRESHOLD;
end
