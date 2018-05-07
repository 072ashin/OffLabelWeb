function r = onTorus(centroids, normals, torus_center, torus_axis, torus_rmajor, torus_rminor, DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD)
% This function check if a set of 3-D points with coordinates "centroids" and normal vectors "normals" are on a torus within thresholds
    m = size(centroids, 1);
    pproj = centroids - repmat(dot(centroids - repmat(torus_center, m, 1), repmat(torus_axis, m, 1), 2), 1, 3) .* repmat(torus_axis, m, 1);
    e = pproj - repmat(torus_center, m, 1);
    e = e ./ repmat(sqrt(sum(e .^ 2, 2)), 1, 3);
    r = repmat(torus_center, m, 1) + torus_rmajor * e;
    d = sqrt(sum((centroids - r) .^ 2, 2));
    torus_normals = (centroids - r) ./ repmat(d, 1, 3);
    distance = d - torus_rminor;
    r = abs(distance) <= DISTANCE_THRESHOLD & abs(dot(torus_normals, normals, 2)) >= NORMAL_DEVIATION_THRESHOLD;
end
