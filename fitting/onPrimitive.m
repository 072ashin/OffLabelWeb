function r = onPrimitive(centroids, normals, primitive, DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD)
    if (primitive(1) == 0)
        r = onPlane(centroids, normals, primitive(3 : 5), primitive(6 : 8), DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD);
    elseif (primitive(1) == 1)
        r = onSphere(centroids, normals, primitive(3 : 5), primitive(6), DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD);
    elseif (primitive(1) == 2)
        r = onCylinder(centroids, normals, primitive(3 : 5), primitive(6 : 8), primitive(9), DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD);
    elseif (primitive(1) == 3)
        r = onCone(centroids, normals, primitive(3 : 5), primitive(6 : 8), primitive(9), DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD);
    elseif (primitive(1) == 4)
        r = onTorus(centroids, normals, primitive(6 : 8), primitive(3 : 5), primitive(9), primitive(10), DISTANCE_THRESHOLD, NORMAL_DEVIATION_THRESHOLD);
    end
end
