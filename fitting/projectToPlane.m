function [projection, projectedNormals] = projectToPlane(primitive, points)
    m = size(points, 1);
    projection = points - repmat(dot(points - repmat(primitive(3 : 5), m, 1), repmat(primitive(6 : 8), m, 1), 2), 1, 3) .* repmat(primitive(6 : 8), m, 1);
    projectedNormals = repmat(primitive(6 : 8), m, 1);
end
