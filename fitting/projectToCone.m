function [projection, projectedNormals] = projectToCone(primitive, points)
    m = size(points, 1);
    p0 = repmat(primitive(3 : 5), m, 1) + repmat(primitive(6 : 8), m, 1) .* repmat(dot(points - repmat(primitive(3 : 5), m, 1), repmat(primitive(6 : 8), m, 1), 2), 1, 3);
    p0p1 = sqrt(sum((points - p0) .^ 2, 2)) * tan(primitive(9));
    p1 = p0 + repmat(primitive(6 : 8), m, 1) .* repmat(p0p1, 1, 3);
    idx = dot(p1 - p0, repmat(primitive(3 : 5), m, 1) - p0, 2) > 0;
    if (sum(idx) > 0)
        p1(idx, :) = p0(idx, :) - repmat(primitive(6 : 8), sum(idx), 1) .* repmat(p0p1(idx), 1, 3);
    end
    projectedNormals = (points - p1) ./ repmat(sqrt(sum((points - p1) .^ 2, 2)), 1, 3);
    projection = p1 + projectedNormals .* repmat(sqrt(sum((p1 - repmat(primitive(3 : 5), m, 1)) .^ 2, 2)), 1, 3) * sin(primitive(9));
end
