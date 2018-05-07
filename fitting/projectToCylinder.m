function [projection, projectedNormals] = projectToCylinder(primitive, points)
    m = size(points, 1);
    u = repmat(primitive(6 : 8), m, 1) + repmat(primitive(3 : 5), m, 1) .* repmat(dot(points - repmat(primitive(6 : 8), m, 1), repmat(primitive(3 : 5), m, 1), 2), 1, 3);
    projectedNormals = (points - u) ./ repmat(sqrt(sum((points - u) .^ 2, 2)), 1, 3);
    projection = u + projectedNormals * primitive(9);
end
