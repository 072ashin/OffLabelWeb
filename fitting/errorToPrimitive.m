function [distanceError, normalError] = errorToPrimitive(primitive, points, normals)
% Args:
% 	primitive: similar format as in fitPrimitive.m
%	points: N x 3 array
% 	normals: N x 3 array, normalized unit normal vectors
% Returns:
% 	distanceError: N x 1 array
% 	normalError: N x 1 array, in degrees
    [projection, projectedNormals] = projectToPrimitive(primitive, points);
    distanceError = sqrt(sum((projection - points) .^ 2, 2));
    normalError = radtodeg(acos(min([ones(size(points, 1), 1), abs(dot(projectedNormals, normals, 2))], [], 2)));
end
