function [projection, projectedNormals] = projectToSphere(primitive, points)
    m = size(points, 1);
    projectedNormals = (points - repmat(primitive(3 : 5), m , 1)) ./ repmat(sqrt(sum((points - repmat(primitive(3 : 5), m , 1)) .^ 2, 2)), 1, 3);
    projection = repmat(primitive(3 : 5), m , 1) + projectedNormals * primitive(6);
end
